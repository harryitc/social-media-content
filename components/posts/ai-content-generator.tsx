"use client"

import { useState } from "react"
import { Sparkles, RefreshCw, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

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
}

export function AIContentGenerator({ onContentGenerated, onImagesGenerated }: AIContentGeneratorProps) {
  const [idea, setIdea] = useState("")
  const [topic, setTopic] = useState("")
  const [tone, setTone] = useState("")
  const [generatedContent, setGeneratedContent] = useState("")
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [selectedImages, setSelectedImages] = useState<Set<number>>(new Set())
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

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

    // Simulate API call
    setTimeout(() => {
      const mockContent = `🎓 ${idea}

Đây là nội dung mẫu được tạo bởi AI dựa trên ý tưởng của bạn. Trong thực tế, nội dung này sẽ được tạo thông qua workflow n8n kết nối với các AI models.

✨ Nội dung đã được tối ưu hóa cho Facebook với:
- Emoji phù hợp
- Hashtag thịnh hành
- Call-to-action rõ ràng

#HUTECH #${topic || "SuKien"} #TinTuc`

      const mockImages = ["/modern-office.jpg", "/teamwork.png", "/abstract-innovation.png", "/path-to-success.png"]

      setGeneratedContent(mockContent)
      setGeneratedImages(mockImages)
      setSelectedImages(new Set())
      setIsLoading(false)
      toast({
        title: "Tạo nội dung thành công!",
        description: "AI đã tạo nội dung dựa trên ý tưởng của bạn.",
      })
    }, 2000)
  }

  const toggleImageSelection = (index: number) => {
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
    const selected = generatedImages.filter((_, index) => selectedImages.has(index))
    onContentGenerated(generatedContent)
    if (selected.length) {
      onImagesGenerated?.(selected)
    }
    setSelectedImages(new Set())
    toast({
      title: selected.length ? "Đã áp dụng nội dung & hình ảnh" : "Đã áp dụng nội dung",
      description: selected.length
        ? `Nội dung và ${selected.length} ảnh AI đã được thêm vào editor.`
        : "Nội dung AI đã được thêm vào editor.",
    })
  }

  return (
    <div className="space-y-4">
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
          {generatedImages.length > 0 && (
            <div className="space-y-3">
              <div className="space-y-1">
                <Label>Hình ảnh gợi ý</Label>
                <p className="text-xs text-muted-foreground">
                  Chọn ảnh bạn muốn thêm. Chúng sẽ được áp dụng cùng lúc với nút "Dùng nội dung này".
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
