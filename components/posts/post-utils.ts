export type PostStatus = 'published' | 'scheduled' | 'draft' | 'error' | 'unknown'

export type NormalizedPost = {
  id: string
  content: string
  createdAt?: string
  status: PostStatus
  images: string[]
  interactions: {
    likes: number
    comments: number
    shares: number
  }
}

export const statusStyles: Record<PostStatus, { label: string; className: string }> = {
  published: { label: 'Đã đăng', className: 'bg-emerald-100 text-emerald-700' },
  scheduled: { label: 'Lên lịch', className: 'bg-indigo-100 text-indigo-700' },
  draft: { label: 'Nháp', className: 'bg-slate-100 text-slate-700' },
  error: { label: 'Lỗi', className: 'bg-rose-100 text-rose-700' },
  unknown: { label: 'Khác', className: 'bg-muted text-foreground' },
}

export function formatDateTime(value?: string) {
  if (!value) return '--'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('vi-VN', { hour12: false })
}
