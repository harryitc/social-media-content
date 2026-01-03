import axios, { AxiosError } from "axios"

const BASE_URL = "http://192.168.137.1:5678/webhook-test"

type ContentApiResponse = Array<{
  content?: string
}>

type HashtagApiResponse = Array<{
  hashtags?: string
}>

type ImageApiResponse = Array<{
  image_urls?: string[]
}>

type PostApiResponse = {
  content?: string
  short_content?: string
  hashtags?: string
  platform?: string
  image_urls?: string[]
}

type UploadSource = File | string

const hasFileSupport = typeof File !== "undefined"
const DATA_URL_REGEX = /^data:(.+);base64,(.*)$/i
const DEFAULT_IMAGE_MIME = "image/png"

const extensionMap: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
}

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 50000, // 30 seconds
})

async function postJson<T>(path: string, body: Record<string, unknown>): Promise<T> {
  try {
    const response = await apiClient.post<T>(path, body)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message?: string }>
      const message = axiosError.response?.data?.message ?? axiosError.message
      throw new Error(message ?? `Yêu cầu ${path} thất bại`)
    }
    throw error
  }
}

const isFileSource = (value: unknown): value is File => hasFileSupport && value instanceof File

const sanitizeFileName = (name: string) => name.replace(/[^a-zA-Z0-9_.-]/g, "_")

const guessExtensionFromMime = (mime?: string) => {
  if (!mime) return "bin"
  return extensionMap[mime] ?? mime.split("/").pop() ?? "bin"
}

const buildFallbackFileName = (index: number, mime?: string) => `image-${index + 1}.${guessExtensionFromMime(mime ?? DEFAULT_IMAGE_MIME)}`

const getFilenameFromUrl = (source: string) => {
  try {
    const parsed = new URL(source)
    const candidate = parsed.pathname.split("/").pop()
    if (!candidate) return null
    return sanitizeFileName(candidate)
  } catch (error) {
    return null
  }
}

const dataUrlToFile = (dataUrl: string, index: number): File | null => {
  const matches = dataUrl.match(DATA_URL_REGEX)
  if (!matches) return null
  const mime = matches[1] || DEFAULT_IMAGE_MIME
  const base64Data = matches[2] || ""
  try {
    const binaryString = atob(base64Data)
    const len = binaryString.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i += 1) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    const filename = buildFallbackFileName(index, mime)
    return new File([bytes], filename, { type: mime })
  } catch (error) {
    console.error("Không thể chuyển đổi data URL thành File", error)
    return null
  }
}

const fetchSourceAsFile = async (source: string, index: number): Promise<File | null> => {
  try {
    const response = await fetch(source)
    if (!response.ok) {
      throw new Error(`Không thể tải ảnh (${response.status})`)
    }
    const blob = await response.blob()
    const mime = blob.type || DEFAULT_IMAGE_MIME
    const filenameFromUrl = getFilenameFromUrl(source)
    const filename = filenameFromUrl ?? buildFallbackFileName(index, mime)
    return new File([blob], filename, { type: mime })
  } catch (error) {
    console.error("Không thể chuyển đổi URL thành File", error)
    return null
  }
}

const convertStringSourceToFile = async (source: string, index: number): Promise<File | null> => {
  if (!source) return null
  if (DATA_URL_REGEX.test(source)) {
    return dataUrlToFile(source, index)
  }
  return fetchSourceAsFile(source, index)
}

async function normalizeUploadFiles(files: UploadSource[]): Promise<File[]> {
  const results = await Promise.all(
    files.map((file, index) => {
      if (!file) return null
      if (isFileSource(file)) return file
      if (typeof file === "string") {
        return convertStringSourceToFile(file, index)
      }
      return null
    }),
  )

  return results.filter((file): file is File => Boolean(file))
}

export async function generateOnlyContent(idea: string): Promise<string> {
  const data = await postJson<ContentApiResponse>("/generate-only-content", { idea })
  const content = data?.[0]?.content?.trim()
  if (!content) {
    throw new Error("API không trả về nội dung")
  }
  return content
}

export async function generateHashtagsFromIdea(platform: string, content: string): Promise<string[]> {
  const data = await postJson<HashtagApiResponse>("/generate-hashtag-with-idea", { platform, content })
  const raw = data?.[0]?.hashtags ?? ""
  return raw
    .split(/\s+/)
    .map((tag) => tag.trim())
    .filter(Boolean)
    .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`))
}

export async function generateImagesFromContent(content: string): Promise<string[]> {
  const data = await postJson<ImageApiResponse>("/generate-image", { content })
  const urls = data
    .map((item) => item.image_urls ?? [])
    .flat()
    .map((url) => url?.trim())
    .filter(Boolean) as string[]

  if (!urls.length) {
    throw new Error("API không trả về hình ảnh")
  }

  return urls
}

export type GeneratedPost = {
  content: string
  shortContent: string
  hashtags: string[]
  images: string[]
}

export async function generatePost(idea: string): Promise<GeneratedPost> {
  const _data: PostApiResponse[] = await postJson<PostApiResponse[]>("/generate-post", { idea })
  
  if (!_data || !_data.length) {
    throw new Error("API không trả về dữ liệu")
  }

  const data = _data?.[0]

  const content = data?.content?.trim()
  if (!content) {
    throw new Error("API không trả về nội dung")
  }

  const shortContent = data?.short_content?.trim() || ""
  
  const hashtags = (data?.hashtags ?? "")
    .split(/[,\s]+/)
    .map((tag) => tag.trim())
    .filter(Boolean)
    .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`))
  
  const images = (data?.image_urls ?? [])
    .map((url) => url?.trim())
    .filter(Boolean) as string[]

  return {
    content,
    shortContent,
    hashtags,
    images,
  }
}

export async function submitPostNow(payload: { content: string; files?: UploadSource[] }) {
  const trimmedContent = payload.content?.trim()
  if (!trimmedContent) {
    throw new Error("Nội dung không hợp lệ")
  }

  const normalizedFiles = await normalizeUploadFiles(payload.files ?? [])
  const formData = new FormData()
  formData.append("content", trimmedContent)

  normalizedFiles.forEach((file, index) => {
    const filename = file.name || buildFallbackFileName(index)
    formData.append("files", file, filename)
  })

  await apiClient.post("/action-submit-now", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
}
