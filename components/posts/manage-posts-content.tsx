"use client"

import { useEffect, useMemo, useState, type ChangeEvent } from "react"
import Image from "next/image"
import { AlertCircle, CalendarRange, Loader2, RefreshCcw, ThumbsUp, MessageCircle, Share2, GalleryHorizontalEnd } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

const statusStyles: Record<string, { label: string; className: string }> = {
  published: { label: "Đã đăng", className: "bg-emerald-100 text-emerald-700" },
  scheduled: { label: "Lên lịch", className: "bg-indigo-100 text-indigo-700" },
  draft: { label: "Nháp", className: "bg-slate-100 text-slate-700" },
  error: { label: "Lỗi", className: "bg-rose-100 text-rose-700" },
  unknown: { label: "Khác", className: "bg-muted text-foreground" },
}

type NormalizedPost = {
  id: string
  content: string
  createdAt?: string
  status: keyof typeof statusStyles
  images: string[]
  interactions: {
    likes: number
    comments: number
    shares: number
  }
}

type DateRange = {
  since: string
  until: string
}

type FilterMode = "all" | "year" | "range"

export function ManagePostsContent() {
  const [posts, setPosts] = useState<NormalizedPost[]>([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pageId, setPageId] = useState("")
  const [graphApiVersion, setGraphApiVersion] = useState("")
  const [filterMode, setFilterMode] = useState<FilterMode>("range")
  const [filterYear, setFilterYear] = useState<string>(() => String(new Date().getFullYear()))
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const today = new Date()
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(today.getDate() - 30)

    return {
      since: thirtyDaysAgo.toISOString().slice(0, 10),
      until: today.toISOString().slice(0, 10),
    }
  })

  const totalInteractions = useMemo(
    () =>
      posts.reduce<{ likes: number; comments: number; shares: number }>((acc, post) => {
        acc.likes += post.interactions.likes
        acc.comments += post.interactions.comments
        acc.shares += post.interactions.shares
        return acc
      },
      { likes: 0, comments: 0, shares: 0 }),
    [posts],
  )

  useEffect(() => {
    fetchPosts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function fetchPosts() {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      const resolvedRange = resolveRange(filterMode, dateRange, filterYear)
      if (resolvedRange.since) params.set("since", resolvedRange.since)
      if (resolvedRange.until) params.set("until", resolvedRange.until)
      if (pageId) params.set("pageId", pageId)
      if (graphApiVersion) params.set("graphApiVersion", graphApiVersion)

      const response = await fetch(`/api/facebook/posts?${params.toString()}`)
      if (!response.ok) {
        throw new Error(`API trả về lỗi ${response.status}`)
      }
      const payload = await response.json()
      const normalized = normalizePosts(payload)
      setPosts(normalized)
      setPage(1)
    } catch (err: any) {
      setError(err?.message || "Không thể tải dữ liệu bài đăng")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(posts.length / pageSize))
    if (page > totalPages) setPage(totalPages)
  }, [posts, page, pageSize])

  const pagedPosts = useMemo(() => {
    const start = (page - 1) * pageSize
    return posts.slice(start, start + pageSize)
  }, [posts, page, pageSize])

  const totalPages = useMemo(() => Math.max(1, Math.ceil(posts.length / pageSize)), [posts.length, pageSize])

  function normalizePosts(payload: any): NormalizedPost[] {
    const rawPosts =
      (Array.isArray(payload?.data) && payload.data) ||
      (Array.isArray(payload?.posts) && payload.posts) ||
      (Array.isArray(payload?.items) && payload.items) ||
      (Array.isArray(payload) && payload) ||
      []

    return rawPosts
      .map((post: any) => {
        const images = extractImages(post)
        const status = normalizeStatus(post)
        const interactions = normalizeInteractions(post)

        const content =
          post?.message || post?.story || post?.content || post?.description || post?.caption || "(Không có nội dung)"

        const createdAt =
          post?.created_time || post?.createdTime || post?.published_time || post?.scheduled_publish_time || post?.updated_time

        return {
          id: String(post?.id ?? ""),
          content,
          createdAt,
          status,
          images,
          interactions,
        } satisfies NormalizedPost
      })
      .filter((item: NormalizedPost) => Boolean(item.id))
  }

  function extractImages(post: any): string[] {
    const results: string[] = []

    if (Array.isArray(post?.images)) {
      results.push(...post.images)
    }

    if (Array.isArray(post?.attachments?.data)) {
      post.attachments.data.forEach((att: any) => {
        const src = att?.media?.image?.src || att?.media?.source || att?.full_picture || att?.picture
        if (src) results.push(src)
      })
    }

    if (post?.full_picture) results.push(post.full_picture)
    if (post?.picture) results.push(post.picture)

    return Array.from(new Set(results.filter(Boolean)))
  }

  function normalizeStatus(post: any): keyof typeof statusStyles {
    const raw = (post?.status || post?.state || post?.postStatus || "published").toString().toLowerCase()

    if (raw.includes("schedule")) return "scheduled"
    if (raw.includes("draft")) return "draft"
    if (raw.includes("error")) return "error"
    if (raw.includes("publish") || raw === "published") return "published"
    return "unknown"
  }

  function normalizeInteractions(post: any) {
    const likes =
      post?.likes?.summary?.total_count ??
      post?.reactions?.summary?.total_count ??
      post?.likeCount ??
      post?.likes ??
      post?.engagement?.like ??
      0

    const comments =
      post?.comments?.summary?.total_count ??
      post?.commentCount ??
      post?.comments ??
      post?.engagement?.comment ??
      0

    const shares = post?.shares?.count ?? post?.shareCount ?? post?.shares ?? post?.engagement?.share ?? 0

    return {
      likes: Number(likes) || 0,
      comments: Number(comments) || 0,
      shares: Number(shares) || 0,
    }
  }

  const hasPosts = posts.length > 0

  const activeRangeLabel = useMemo(() => {
    if (filterMode === "all") return "Tất cả thời gian"
    if (filterMode === "year") {
      const { since, until, year } = getYearRange(filterYear)
      return `Năm ${year}: ${since} → ${until}`
    }
    return `${dateRange.since} → ${dateRange.until}`
  }, [filterMode, filterYear, dateRange])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarRange className="h-4 w-4" />
          <span>Khoảng thời gian: {activeRangeLabel}</span>
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý đăng bài</h1>
          <p className="text-muted-foreground mt-1">Xem nhanh hiệu suất và trạng thái các bài đăng Facebook.</p>
        </div>
      </div>

      <Card className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { value: "all", label: "Tất cả" },
              { value: "year", label: "Theo năm" },
              { value: "range", label: "Khoảng thời gian" },
            ].map((item) => (
              <Button
                key={item.value}
                size="sm"
                variant={filterMode === item.value ? "default" : "outline"}
                onClick={() => setFilterMode(item.value as FilterMode)}
              >
                {item.label}
              </Button>
            ))}
          </div>

          <div className="grid gap-3 md:grid-cols-4">
            {filterMode === "year" && (
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Năm</label>
                <Input
                  type="number"
                  min="1970"
                  max="9999"
                  value={filterYear}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setFilterYear(e.target.value)}
                  placeholder="2025"
                />
              </div>
            )}

            {filterMode === "range" && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Từ ngày</label>
                  <Input
                    type="date"
                    value={dateRange.since}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setDateRange((prev: DateRange) => ({ ...prev, since: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Đến ngày</label>
                  <Input
                    type="date"
                    value={dateRange.until}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setDateRange((prev: DateRange) => ({ ...prev, until: e.target.value }))
                    }
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchPosts} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCcw className="mr-2 h-4 w-4" />}
              Làm mới dữ liệu
            </Button>
            <Badge variant="outline" className="rounded-full">
              Tổng bài: {posts.length}
            </Badge>
            <Badge variant="outline" className="rounded-full">
              Lượt thích: {totalInteractions.likes}
            </Badge>
            <Badge variant="outline" className="rounded-full">
              Bình luận: {totalInteractions.comments}
            </Badge>
            <Badge variant="outline" className="rounded-full">
              Chia sẻ: {totalInteractions.shares}
            </Badge>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/30 px-4 py-3 text-sm">
          <div className="flex items-center gap-2">
            <span>Hiển thị</span>
            <Select value={String(pageSize)} onValueChange={(val) => setPageSize(Number(val))}>
              <SelectTrigger className="h-8 w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 40, 60, 100].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size} / trang
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Trước
            </Button>
            <span>
              Trang {page}/{totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Sau
            </Button>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="border-b border-border bg-muted/40 px-4 py-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <GalleryHorizontalEnd className="h-4 w-4" />
              <span>Bảng bài đăng</span>
            </div>
            {loading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Đang tải dữ liệu
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">#</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Hình ảnh</TableHead>
                <TableHead>Nội dung</TableHead>
                <TableHead>Ngày giờ đăng</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Tương tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && renderSkeletonRows()}
              {!loading && hasPosts &&
                pagedPosts.map((post, index) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{(page - 1) * pageSize + index + 1}</TableCell>
                    <TableCell className="max-w-45 text-xs text-muted-foreground">{post.id}</TableCell>
                    <TableCell>
                      {post.images.length > 0 ? (
                        <div className="relative h-12 w-12 overflow-hidden rounded-lg border">
                          <Image src={post.images[0]} alt="Ảnh bài đăng" fill className="object-cover" />
                          {post.images.length > 1 && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs font-semibold text-white">
                              +{post.images.length - 1}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
                          <ImageFallbackIcon />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="max-w-[320px]">
                      <p className="line-clamp-2 text-sm leading-relaxed text-foreground/90">{post.content}</p>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {formatDateTime(post.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("text-xs", statusStyles[post.status]?.className)}>
                        {statusStyles[post.status]?.label || statusStyles.unknown.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="flex items-center gap-1 text-blue-600">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{post.interactions.likes}</span>
                        </div>
                        <div className="flex items-center gap-1 text-emerald-600">
                          <MessageCircle className="h-4 w-4" />
                          <span>{post.interactions.comments}</span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-600">
                          <Share2 className="h-4 w-4" />
                          <span>{post.interactions.shares}</span>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

              {!loading && !hasPosts && (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                    Chưa có dữ liệu trong khoảng thời gian này.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}

function getYearRange(inputYear: string) {
  const parsed = Number.parseInt(inputYear, 10)
  const fallback = new Date().getFullYear()
  const year = Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
  const since = `${year}-01-01`
  const until = `${year}-12-31`
  return { since, until, year }
}

function resolveRange(mode: FilterMode, dateRange: DateRange, filterYear: string) {
  if (mode === "all") return { since: undefined, until: undefined }
  if (mode === "year") return getYearRange(filterYear)
  return dateRange
}

function formatDateTime(value?: string) {
  if (!value) return "--"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString("vi-VN", { hour12: false })
}

function renderSkeletonRows() {
  return Array.from({ length: 5 }).map((_, idx) => (
    <TableRow key={idx}>
      <TableCell>
        <Skeleton className="h-4 w-8" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-40" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-12 w-12 rounded-lg" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-72" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-28" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-20 rounded-full" />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
        </div>
      </TableCell>
    </TableRow>
  ))
}

function ImageFallbackIcon() {
  return <div className="flex items-center gap-1 text-[11px]"><GalleryHorizontalEnd className="h-4 w-4" />Ảnh</div>
}
