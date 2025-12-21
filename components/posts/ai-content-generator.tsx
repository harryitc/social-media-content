"use client"

import { useState } from "react"
import { Sparkles, RefreshCw } from "lucide-react"
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
      setIsLoading(false)
      toast({
        title: "Tạo nội dung thành công!",
        description: "AI đã tạo nội dung dựa trên ý tưởng của bạn.",
      })
    }, 2000)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Ý tưởng bài viết</Label>
        <Input placeholder="Nhập ý tưởng..." value={idea} onChange={(e) => setIdea(e.target.value)} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
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
        </div>

        <div className="space-y-2">
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
        </div>
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
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => {
                onContentGenerated(generatedContent)
                toast({
                  title: "Đã áp dụng nội dung",
                  description: "Nội dung AI đã được thêm vào editor.",
                })
              }}
            >
              Dùng nội dung này
            </Button>
            <Button size="sm" variant="outline" onClick={generateContent}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Tạo lại
            </Button>
          </div>
          {generatedImages.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Hình ảnh gợi ý</Label>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    onImagesGenerated?.(generatedImages)
                    toast({
                      title: "Đã thêm hình ảnh",
                      description: `${generatedImages.length} ảnh AI được đưa vào bài viết.`,
                    })
                  }}
                >
                  Thêm tất cả ảnh
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {generatedImages.map((image, index) => (
                  <div key={image + index} className="overflow-hidden rounded-lg border">
                    <img src={image || "/placeholder.svg"} alt={`AI image ${index + 1}`} className="h-32 w-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
