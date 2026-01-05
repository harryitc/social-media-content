import { NextResponse } from "next/server"

const upstreamBaseCandidates = [
  process.env.BACKEND_URL,
  process.env.NEXT_PUBLIC_BACKEND_URL,
  "http://host.docker.internal:8080",
  "http://127.0.0.1:8080",
  "http://localhost:8080",
].filter(Boolean) as string[]

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const attempted: Array<{ target: string; error: string }> = []

  for (const base of upstreamBaseCandidates) {
    const upstreamUrl = new URL("/api/facebook/posts", base)
    searchParams.forEach((value, key) => upstreamUrl.searchParams.set(key, value))
    const target = upstreamUrl.toString()

    try {
      const upstream = await fetch(target, { cache: "no-store" })
      const contentType = upstream.headers.get("content-type") || "application/json"
      const body = await upstream.text()

      return new NextResponse(body, {
        status: upstream.status,
        headers: { "content-type": contentType },
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error"
      attempted.push({ target, error: message })
      console.error("Proxy /api/facebook/posts failed", { target, error })
      continue
    }
  }

  return NextResponse.json(
    {
      error: "Upstream unavailable",
      attempts: attempted,
      hint: "Set BACKEND_URL (or NEXT_PUBLIC_BACKEND_URL) to the reachable API base",
    },
    { status: 502 },
  )
}
