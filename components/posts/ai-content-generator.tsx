"use client"

import { useEffect, useState } from "react"
import { Sparkles, RefreshCw, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { generateOnlyContent, generatePost } from "@/lib/ai-service"

const topics = [
  { value: "marketing", label: "Marketing" },
  { value: "education", label: "Giáo dục" },
  { value: "event", label: "Sự kiện" },
  { value: "inspiration", label: "Truyền cảm hứng" },
  { value: "other", label: "Khác" },
]

const tones = [
  { value: "friendly", label: "Thân thiện" },
  { value: "professional", label: "Chuyên nghiệp" },
  { value: "humorous", label: "Hài hước" },
  { value: "formal", label: "Trang trọng" },
]

interface AIContentGeneratorProps {
  onContentGenerated: (content: string) => void
  onImagesGenerated?: (images: string[]) => void
  mode?: "content" | "all"
}

export function AIContentGenerator({ onContentGenerated, onImagesGenerated, mode = "all" }: AIContentGeneratorProps) {
  const isContentOnly = mode === "content"
  const [idea, setIdea] = useState("")
  const [topic, setTopic] = useState("")
  const [tone, setTone] = useState("")
  const [generatedContent, setGeneratedContent] = useState("")
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [selectedImages, setSelectedImages] = useState<Set<number>>(new Set())
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (isContentOnly) {
      setGeneratedImages([])
      setSelectedImages(new Set())
    }
  }, [isContentOnly])

  const generateContent = async () => {
    if (!idea.trim()) {
      toast({
        title: "Vui lòng nhập ý tưởng",
        description: "Bạn cần nhập ý tưởng để AI có thể tạo nội dung.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const trimmedIdea = idea.trim()

      if (isContentOnly) {
        // Chế độ Đơn giản: chỉ sinh nội dung
        const contentResult = await generateOnlyContent(trimmedIdea)
        setGeneratedContent(contentResult)
        setGeneratedImages([])
        setSelectedImages(new Set())
      } else {
        // Chế độ Đặc biệt: sinh tất cả (content + images + hashtags)
        const postResult = await generatePost(trimmedIdea)
        
        // Ghép content với hashtags
        const fullContent = postResult.hashtags.length
          ? `${postResult.content}\n\n${postResult.hashtags.join(" ")}`
          : postResult.content
        
        setGeneratedContent(fullContent)
        setGeneratedImages(postResult.images)
        setSelectedImages(new Set())
      }

      toast({
        title: "Tạo nội dung thành công!",
        description: "AI đã tạo nội dung dựa trên ý tưởng của bạn.",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Không thể tạo nội dung",
        description: "Vui lòng thử lại hoặc kiểm tra kết nối.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleImageSelection = (index: number) => {
    if (isContentOnly) return
    const updated = new Set(selectedImages)
    if (updated.has(index)) {
      updated.delete(index)
    } else {
      updated.add(index)
    }
    setSelectedImages(updated)
  }

  const applyGeneratedResult = () => {
    if (!generatedContent) return
    const selected = isContentOnly ? [] : generatedImages.filter((_, index) => selectedImages.has(index))
    onContentGenerated(generatedContent)
    if (selected.length) {
      onImagesGenerated?.(selected)
    }
    setSelectedImages(new Set())
    toast({
      title:
        selected.length && !isContentOnly ? "Đã áp dụng nội dung & hình ảnh" : "Đã áp dụng nội dung",
      description:
        selected.length && !isContentOnly
          ? `Nội dung và ${selected.length} ảnh AI đã được thêm vào editor.`
          : "Nội dung AI đã được thêm vào editor.",
    })
  }

  return (
    <div className="space-y-4">
      {/* <p className="text-xs text-muted-foreground">
        {isContentOnly
          ? "Chế độ Chỉ nội dung: AI sinh caption dựa trên ý tưởng, không tạo thêm hình ảnh."
          : "Chế độ Tất cả: AI sinh caption và kèm theo danh sách hình ảnh gợi ý để lựa chọn."}
      </p> */}
      <div className="space-y-2">
        <Label>Ý tưởng bài viết</Label>
        <Input placeholder="Nhập ý tưởng..." value={idea} onChange={(e) => setIdea(e.target.value)} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* <div className="space-y-2">
          <Label>Chủ đề</Label>
          <Select value={topic} onValueChange={setTopic}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn chủ đề" />
            </SelectTrigger>
            <SelectContent>
              {topics.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div> */}

        {/* <div className="space-y-2">
          <Label>Giọng văn</Label>
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn giọng văn" />
            </SelectTrigger>
            <SelectContent>
              {tones.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div> */}
      </div>

      <Button onClick={generateContent} disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Đang tạo...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Tạo nội dung với AI
          </>
        )}
      </Button>

      {generatedContent && (
        <div className="space-y-3 rounded-lg border border-primary/50 bg-primary/5 p-4">
          <Label>Kết quả</Label>
          <Textarea
            value={generatedContent}
            onChange={(e) => setGeneratedContent(e.target.value)}
            className="min-h-[150px]"
          />
          {!isContentOnly && generatedImages.length > 0 && (
            <div className="space-y-3">
              <div className="space-y-1">
                <Label>Hình ảnh gợi ý từ AI</Label>
                <p className="text-xs text-muted-foreground">
                  Chọn các ảnh phù hợp; chúng được chèn cùng lúc với nút "Dùng nội dung này".
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {generatedImages.map((image, index) => (
                  <div
                    key={image + index}
                    onClick={() => toggleImageSelection(index)}
                    className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl border-2 border-border transition-all hover:border-primary"
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`AI image ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                    {selectedImages.has(index) && (
                      <div className="absolute inset-0 flex items-center justify-center bg-primary/80">
                        <Check className="h-8 w-8 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>
          )}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
            <Button variant="outline" onClick={generateContent}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Tạo lại
            </Button>
            <Button onClick={applyGeneratedResult}>Dùng nội dung này</Button>
          </div>
        </div>
      )}
    </div>
  )
}
