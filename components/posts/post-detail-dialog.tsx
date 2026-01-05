'use client'

import Image from 'next/image'
import { MessageCircle, Share2, ThumbsUp } from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

import { formatDateTime, statusStyles, type NormalizedPost } from './post-utils'

type PostDetailDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  post: NormalizedPost | null
}

function PostDetailDialog({ open, onOpenChange, post }: PostDetailDialogProps) {
  const selectedStatus = post ? statusStyles[post.status] || statusStyles.unknown : null
  const [analysisOpen, setAnalysisOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader className="gap-1">
          <DialogTitle>Chi tiết bài đăng</DialogTitle>
          <DialogDescription className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-medium text-foreground">ID: {post?.id || '--'}</span>
            {selectedStatus && (
              <Badge className={cn('text-xs', selectedStatus.className)}>{selectedStatus.label}</Badge>
            )}
          </DialogDescription>
        </DialogHeader>

        {post ? (
          <div className="space-y-4">
            <div className="rounded-lg border p-3">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                {post.content || '(Không có nội dung)'}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <InfoItem label="Ngày đăng" value={formatDateTime(post.createdAt)} />
              <InfoItem
                label="Lượt thích"
                value={post.interactions.likes}
                icon={<ThumbsUp className="h-4 w-4 text-blue-600" />}
              />
              <InfoItem
                label="Bình luận"
                value={post.interactions.comments}
                icon={<MessageCircle className="h-4 w-4 text-emerald-600" />}
              />
              <InfoItem
                label="Chia sẻ"
                value={post.interactions.shares}
                icon={<Share2 className="h-4 w-4 text-amber-600" />}
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">Hình ảnh</h3>
              {post.images.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-3">
                  {post.images.map((src) => (
                    <div
                      key={src}
                      className="relative aspect-square overflow-hidden rounded-lg border bg-muted"
                    >
                      <Image src={src} alt="Ảnh bài đăng" fill className="object-cover" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-24 items-center justify-center rounded-lg border bg-muted text-sm text-muted-foreground">
                  Không có hình ảnh
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">Không có dữ liệu bài đăng.</div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setAnalysisOpen(true)}>
            Phân tích tương tác
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>

      <InteractionAnalysisDialog
        open={analysisOpen}
        onOpenChange={(next) => {
          setAnalysisOpen(next)
        }}
      />
    </Dialog>
  )
}

function InfoItem({
  label,
  value,
  icon,
}: {
  label: string
  value: ReactNode
  icon?: ReactNode
}) {
  return (
    <div className="rounded-lg border bg-muted/40 p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 flex items-center gap-2 text-sm font-medium text-foreground">
        {icon}
        <span>{value}</span>
      </div>
    </div>
  )
}

export { PostDetailDialog }

type InteractionComment = {
  id: string
  author: string
  language: string
  sentiment: 'positive' | 'negative'
  score: number
  likes: number
  replies: number
  preview: string
}

type InteractionAnalysis = {
  topPositive: InteractionComment[]
  topNegative: InteractionComment[]
  topImpact: InteractionComment
}

function InteractionAnalysisDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const mockAnalysis: InteractionAnalysis = useMemo(
    () => ({
      topPositive: [
        {
          id: 'c1',
          author: 'Nguyễn An',
          language: 'vi',
          sentiment: 'positive',
          score: 0.92,
          likes: 34,
          replies: 5,
          preview: 'Bài viết rất hữu ích, cảm ơn bạn đã chia sẻ! ❤️',
        },
        {
          id: 'c2',
          author: 'Alice Chen',
          language: 'en',
          sentiment: 'positive',
          score: 0.88,
          likes: 21,
          replies: 2,
          preview: "Loved this insight, it's spot on for our team!",
        },
        {
          id: 'c3',
          author: 'Juan Pérez',
          language: 'es',
          sentiment: 'positive',
          score: 0.84,
          likes: 18,
          replies: 1,
          preview: 'Excelente contenido, muy claro y directo.',
        },
        {
          id: 'c4',
          author: 'Soo-min',
          language: 'ko',
          sentiment: 'positive',
          score: 0.81,
          likes: 15,
          replies: 3,
          preview: '정말 유용한 팁이네요. 고마워요!',
        },
        {
          id: 'c5',
          author: 'Marie Dubois',
          language: 'fr',
          sentiment: 'positive',
          score: 0.79,
          likes: 12,
          replies: 0,
          preview: 'Super article, très instructif.',
        },
      ],
      topNegative: [
        {
          id: 'c6',
          author: 'Trần Bình',
          language: 'vi',
          sentiment: 'negative',
          score: -0.83,
          likes: 9,
          replies: 4,
          preview: 'Thông tin chưa chính xác, mình nghĩ cần kiểm chứng thêm.',
        },
        {
          id: 'c7',
          author: 'Lisa Müller',
          language: 'de',
          sentiment: 'negative',
          score: -0.78,
          likes: 6,
          replies: 1,
          preview: 'Ich finde die Zahlen etwas irreführend.',
        },
        {
          id: 'c8',
          author: 'John Smith',
          language: 'en',
          sentiment: 'negative',
          score: -0.74,
          likes: 5,
          replies: 0,
          preview: "Not convinced this approach works in real cases.",
        },
        {
          id: 'c9',
          author: 'Akira',
          language: 'ja',
          sentiment: 'negative',
          score: -0.7,
          likes: 4,
          replies: 2,
          preview: 'データの根拠が弱いと思います。',
        },
        {
          id: 'c10',
          author: 'Fatima',
          language: 'ar',
          sentiment: 'negative',
          score: -0.66,
          likes: 3,
          replies: 0,
          preview: 'أعتقد أن هناك تفاصيل مفقودة هنا.',
        },
      ],
      topImpact: {
        id: 'c11',
        author: 'Minh Hoàng',
        language: 'vi',
        sentiment: 'positive',
        score: 0.86,
        likes: 48,
        replies: 9,
        preview: 'Tổng hợp quá đầy đủ, team mình sẽ áp dụng ngay. Ai có thêm tài liệu thì share với nhé!',
      },
    }),
    [],
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader className="gap-1">
          <DialogTitle>Phân tích tương tác (mock data)</DialogTitle>
          <DialogDescription>
            Dữ liệu mẫu để hiển thị khi AI trả về JSON: top bình luận tích cực/tiêu cực và bình luận có tác động cao nhất.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold">Top 5 tích cực</h3>
                <span className="text-xs text-muted-foreground">Đa ngôn ngữ</span>
              </div>
              <div className="space-y-3">
                {mockAnalysis.topPositive.map((item, idx) => (
                  <CommentRow key={item.id} rank={idx + 1} data={item} />
                ))}
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold">Top 5 tiêu cực</h3>
                <span className="text-xs text-muted-foreground">Đa ngôn ngữ</span>
              </div>
              <div className="space-y-3">
                {mockAnalysis.topNegative.map((item, idx) => (
                  <CommentRow key={item.id} rank={idx + 1} data={item} />
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-lg border p-4">
            <h3 className="text-sm font-semibold">Bình luận tác động cao nhất</h3>
            <CommentRow rank={1} data={mockAnalysis.topImpact} highlight />
          </section>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function CommentRow({
  rank,
  data,
  highlight,
}: {
  rank: number
  data: InteractionComment
  highlight?: boolean
}) {
  return (
    <div
      className={cn(
        'border-border/60 bg-muted/30 flex gap-3 rounded-md border p-3',
        highlight && 'border-primary/60 bg-primary/5',
      )}
    >
      <div className="text-muted-foreground flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold">
        {rank}
      </div>
      <div className="space-y-1 text-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-foreground">{data.author}</span>
          <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] uppercase text-muted-foreground">
            {data.language}
          </span>
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-[11px] font-semibold',
              data.sentiment === 'positive'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-rose-100 text-rose-700',
            )}
          >
            {data.sentiment === 'positive' ? 'Tích cực' : 'Tiêu cực'} ({data.score.toFixed(2)})
          </span>
        </div>
        <p className="text-foreground/90 leading-relaxed">{data.preview}</p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>👍 {data.likes} like</span>
          <span>💬 {data.replies} reply</span>
        </div>
      </div>
    </div>
  )
}
