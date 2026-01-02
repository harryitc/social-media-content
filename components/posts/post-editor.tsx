"use client"

import { useEffect, useRef, useState } from "react"
import { Upload, X, Smile, GripVertical, Wand2, Sparkles, ImagePlus, NotebookPen, RefreshCw, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AIContentGenerator } from "@/components/posts/ai-content-generator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

interface PostEditorProps {
  content: string
  onContentChange: (content: string) => void
  images: string[]
  onImagesChange: (images: string[]) => void
  scheduledTime: string
  onScheduledTimeChange: (value: string) => void
}

type HashtagTemplate = {
  id: string
  name: string
  description: string
  tags: string[]
}

const mergeHashtagsIntoContent = (base: string, tags: string[]) => {
  if (!tags.length) return null
  const existingTagsInContent = new Set(base.match(/#[A-Za-z0-9_À-ỹ]+/g) ?? [])
  const tagsToAdd = tags.filter((tag) => !existingTagsInContent.has(tag))
  if (!tagsToAdd.length) return null
  const trimmed = base.trimEnd()
  const spacer = trimmed.length ? "\n\n" : ""
  return `${trimmed}${spacer}${tagsToAdd.join(" ")}`
}

const hashtagTemplates: HashtagTemplate[] = [
  {
    id: "tuyen-sinh",
    name: "Thông tin tuyển sinh",
    description: "Dùng cho bài viết tư vấn, tuyển sinh niên khóa mới",
    tags: ["#HUTECH", "#TuyenSinh2025", "#NhapHoc", "#CampusLife", "#StudentJourney"],
  },
  {
    id: "hoc-bong",
    name: "Học bổng & hỗ trợ",
    description: "Thông báo học bổng, hỗ trợ học phí",
    tags: ["#HocBong", "#Scholarship", "#HoTroTaiChinh", "#SinhVienTienPhong", "#FutureLeaders"],
  },
  {
    id: "su-kien",
    name: "Sự kiện nổi bật",
    description: "Workshop, hội thảo, sự kiện cộng đồng",
    tags: ["#SuKien", "#Workshop", "#HUTECHEvent", "#Networking", "#KhoiNghiep"],
  },
]

const extractHashtags = (text: string) => {
  return Array.from(
    new Set(
      text
        .toLowerCase()
        .replace(/[#.,!]/g, "")
        .split(/\s+/)
        .filter((word) => word.length > 4),
    ),
  )
    .slice(0, 5)
    .map((word) => `#${word.replace(/[^a-z0-9À-ỹ]/gi, "")}`)
    .filter((tag) => tag.length > 1)
}

export function PostEditor({
  content,
  onContentChange,
  images,
  onImagesChange,
  scheduledTime,
  onScheduledTimeChange,
}: PostEditorProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [isContentAiOpen, setIsContentAiOpen] = useState(false)
  const [contentAiMode, setContentAiMode] = useState<"content" | "all">("all")
  const [isImageGenerating, setIsImageGenerating] = useState(false)
  const [isIdeaHashtagOpen, setIsIdeaHashtagOpen] = useState(false)
  const [hashtagIdea, setHashtagIdea] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imagesRef = useRef(images)
  const { toast } = useToast()

  useEffect(() => {
    imagesRef.current = images
  }, [images])

  const appendHashtagsToContent = (tags: string[]) => {
    const merged = mergeHashtagsIntoContent(content, tags)
    if (!merged) return false
    onContentChange(merged)
    return true
  }

  const handleTemplateHashtags = (template: HashtagTemplate) => {
    const applied = appendHashtagsToContent(template.tags)
    toast({
      title: applied ? "Đã áp dụng template" : "Không có hashtag mới",
      description: applied ? `Đang dùng ${template.name}.` : "Các hashtag trong template đã tồn tại trong nội dung.",
    })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
      onImagesChange([...images, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index))
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newImages = [...images]
    const draggedImage = newImages[draggedIndex]
    newImages.splice(draggedIndex, 1)
    newImages.splice(index, 0, draggedImage)
    onImagesChange(newImages)
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  const runHashtagSuggestion = () => {
    const generated = extractHashtags(content)
    if (!generated.length) {
      toast({
        title: "Không thể tạo hashtag",
        description: "Vui lòng nhập nội dung hoặc thêm thủ công.",
        variant: "destructive",
      })
      return
    }
    const inserted = appendHashtagsToContent(generated)
    toast({
      title: inserted ? "Đã thêm hashtag" : "Không có hashtag mới",
      description: inserted ? "Nội dung đã được chèn hashtag tự động." : "Các hashtag gợi ý đã tồn tại trong nội dung.",
    })
  }

  const runHashtagFromIdea = () => {
    if (!hashtagIdea.trim()) {
      toast({
        title: "Chưa có ý tưởng",
        description: "Nhập ý tưởng hoặc chủ đề trước khi sinh hashtag.",
        variant: "destructive",
      })
      return
    }

    const generated = extractHashtags(hashtagIdea)
    if (!generated.length) {
      toast({
        title: "Không tạo được hashtag",
        description: "Ý tưởng quá ngắn, vui lòng mô tả chi tiết hơn.",
        variant: "destructive",
      })
      return
    }

    const inserted = appendHashtagsToContent(generated)
    toast({
      title: inserted ? "Đã thêm hashtag" : "Không có hashtag mới",
      description: inserted
        ? "Hashtag từ ý tưởng đã được chèn vào nội dung."
        : "Các hashtag từ ý tưởng đã tồn tại trong nội dung.",
    })
    setHashtagIdea("")
    setIsIdeaHashtagOpen(false)
  }

  const handleOpenContentAi = (mode: "content" | "all") => {
    setContentAiMode(mode)
    setIsContentAiOpen(true)
  }

  const handleAiImageGeneration = () => {
    if (isImageGenerating) return
    setIsImageGenerating(true)

    setTimeout(() => {
      const mockImages = ["/modern-office.jpg", "/teamwork.png", "/abstract-innovation.png", "/path-to-success.png"]
      onImagesChange([...imagesRef.current, ...mockImages])
      setIsImageGenerating(false)
      toast({
        title: "AI đã tạo hình ảnh",
        description: "4 hình ảnh gợi ý đã được thêm vào thư viện bài đăng.",
      })
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Nền tảng</Label>
              <Select defaultValue="facebook">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="facebook">
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-[#1877f2]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      Facebook
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Trang đăng</Label>
              <Select defaultValue="page1">
                <SelectTrigger>
                  <SelectValue placeholder="Chọn Fanpage..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="page1">HUTECH Official</SelectItem>
                  <SelectItem value="page2">HUTECH Tuyển sinh</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1 text-sm font-medium">
                <Label className="font-medium">Soạn thảo nội dung</Label>
                <span className="text-destructive" aria-hidden="true">*</span>
                <span className="sr-only">Bắt buộc</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Smile className="mr-1 h-4 w-4" />
                  Emoji
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Sparkles className="h-4 w-4" />
                      Nội dung
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-72">
                    {/* <DropdownMenuLabel>Chọn phạm vi</DropdownMenuLabel> */}
                    <DropdownMenuItem onSelect={() => handleOpenContentAi("content")}>
                      <div>
                        <p className="text-sm font-medium">Đơn giản</p>
                        <p className="text-xs text-muted-foreground">Sinh nội dung dựa trên ý tưởng</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleOpenContentAi("all")}>
                      <div>
                        <p className="text-sm font-medium">Đặc biệt</p>
                        <p className="text-xs text-muted-foreground">Sinh nội dung dựa trên ý tưởng, kèm hình ảnh</p>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <Textarea
              placeholder="Nhập nội dung bài đăng..."
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              className="min-h-[220px] resize-none"
            />
            <div className="flex items-center justify-end text-sm text-muted-foreground">
              <span>{content.length} ký tự</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Label>Hashtag</Label>
                <p className="text-muted-foreground text-sm">Tự động sinh dựa trên nội dung bài viết.</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Wand2 className="h-4 w-4" />
                    Sinh hashtag
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-72" align="end">
                  <DropdownMenuLabel>Nguồn tạo hashtag</DropdownMenuLabel>
                  <DropdownMenuItem
                    disabled={!content.trim()}
                    onSelect={() => {
                      if (!content.trim()) return
                      runHashtagSuggestion()
                    }}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    <div>
                      <p className="text-sm font-medium">Từ nội dung soạn thảo</p>
                      <p className="text-muted-foreground text-xs">Phân tích đoạn text hiện tại để sinh hashtag.</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setIsIdeaHashtagOpen(true)}>
                    <Lightbulb className="mr-2 h-4 w-4" />
                    <div>
                      <p className="text-sm font-medium">Từ ý tưởng</p>
                      <p className="text-muted-foreground text-xs">Nhập ý tưởng nhanh và nhận hashtag phù hợp.</p>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Template chủ đề</DropdownMenuLabel>
                  {hashtagTemplates.map((template) => (
                    <DropdownMenuItem
                      key={template.id}
                      onSelect={() => handleTemplateHashtags(template)}
                    >
                      <NotebookPen className="mr-2 h-4 w-4" />
                      <div>
                        <p className="text-sm font-medium">{template.name}</p>
                        <p className="text-muted-foreground text-xs">{template.description}</p>
                        <p className="text-muted-foreground text-xs">{template.tags.join(" ")}</p>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="rounded-lg border border-dashed border-muted-foreground/30 bg-muted/30 p-3 text-sm text-muted-foreground">
              Hashtag được thêm trực tiếp vào nội dung phía trên. Bạn có thể chỉnh sửa hoặc xóa thủ công trong phần soạn thảo.
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="font-medium">Hình ảnh</Label>
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={handleAiImageGeneration}
                disabled={isImageGenerating}
              >
                {isImageGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Đang sinh ảnh...
                  </>
                ) : (
                  <>
                    <ImagePlus className="h-4 w-4" />
                    AI hình ảnh
                  </>
                )}
              </Button>
            </div>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer rounded-xl border-2 border-dashed border-border bg-muted/30 p-8 text-center transition-colors hover:border-primary hover:bg-muted/50"
            >
              <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium">Kéo thả hoặc click để tải ảnh lên</p>
              <p className="text-xs text-muted-foreground">PNG, JPG, GIF (tối đa 10MB)</p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {images.map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className="group relative aspect-square cursor-move overflow-hidden rounded-xl border border-border bg-muted"
                  >
                    <img src={image || "/placeholder.svg"} alt={`Upload ${index + 1}`} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                      <GripVertical className="h-5 w-5 text-white" />
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute right-2 top-2 h-7 w-7"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    {index === 0 && <Badge className="absolute bottom-2 left-2">Ảnh bìa</Badge>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-dashed border-muted-foreground/30 bg-muted/20 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-1 text-sm font-semibold">
                  <Label className="text-base font-semibold">Thời gian đăng</Label>
                  <span className="text-destructive" aria-hidden="true">*</span>
                  <span className="sr-only">Bắt buộc khi lên lịch</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Chọn thời điểm bài viết sẽ tự động đăng. Để trống nếu bạn muốn đăng ngay sau khi hoàn tất.
                </p>
              </div>
              <div className="w-full sm:w-auto">
                <Input
                  type="datetime-local"
                  value={scheduledTime}
                  onChange={(e) => onScheduledTimeChange(e.target.value)}
                  className="sm:w-56"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isContentAiOpen} onOpenChange={setIsContentAiOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>AI Nội dung</DialogTitle>
          </DialogHeader>
          <AIContentGenerator
            mode={contentAiMode}
            onContentGenerated={(generated) => {
              onContentChange(generated)
              setIsContentAiOpen(false)
            }}
            onImagesGenerated={(newImages) => onImagesChange([...images, ...newImages])}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isIdeaHashtagOpen} onOpenChange={setIsIdeaHashtagOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Sinh hashtag từ ý tưởng</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Ý tưởng</Label>
              <Textarea
                placeholder="Nhập ý tưởng, chủ đề hoặc mô tả chiến dịch..."
                value={hashtagIdea}
                onChange={(e) => setHashtagIdea(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
            <Button className="w-full" onClick={runHashtagFromIdea}>
              <Sparkles className="mr-2 h-4 w-4" />
              Sinh hashtag
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
