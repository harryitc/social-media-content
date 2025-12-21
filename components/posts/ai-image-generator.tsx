"use client"

import { useState, useRef } from "react"
import { Sparkles, RefreshCw, Upload, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"

interface AIImageGeneratorProps {
  onImagesGenerated: (images: string[]) => void
  currentImages: string[]
}

export function AIImageGenerator({ onImagesGenerated, currentImages }: AIImageGeneratorProps) {
  const [useContent, setUseContent] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [selectedImages, setSelectedImages] = useState<Set<number>>(new Set())
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const generateImages = async () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const mockImages = [
        "/modern-office.jpg",
        "/teamwork.png",
        "/abstract-innovation.png",
        "/path-to-success.png",
      ]

      setGeneratedImages(mockImages)
      setIsLoading(false)
      toast({
        title: "Tạo hình ảnh thành công!",
        description: "AI đã tạo 4 hình ảnh dựa trên nội dung của bạn.",
      })
    }, 3000)
  }

  const toggleImageSelection = (index: number) => {
    const newSelected = new Set(selectedImages)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelectedImages(newSelected)
  }

  const addSelectedImages = () => {
    const selected = generatedImages.filter((_, index) => selectedImages.has(index))
    onImagesGenerated([...currentImages, ...selected])
    setSelectedImages(new Set())
    toast({
      title: "Đã thêm hình ảnh",
      description: `${selected.length} hình ảnh đã được thêm vào bài đăng.`,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-lg border border-border p-4">
        <div className="space-y-0.5">
          <Label>Tạo ảnh từ nội dung</Label>
          <p className="text-xs text-muted-foreground">Sử dụng nội dung bài viết để tạo hình ảnh</p>
        </div>
        <Switch checked={useContent} onCheckedChange={setUseContent} />
      </div>

      {!useContent && (
        <div className="space-y-2">
          <Label>Ảnh tham chiếu</Label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-border bg-muted/30 p-6 text-center transition-colors hover:border-primary"
          >
            <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm">Upload ảnh tham chiếu</p>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" />
          </div>
        </div>
      )}

      <Button onClick={generateImages} disabled={isLoading} className="w-full">
        {isLoading ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Đang tạo hình ảnh...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Tạo hình ảnh với AI
          </>
        )}
      </Button>

      {generatedImages.length > 0 && (
        <div className="space-y-3">
          <Label>Chọn hình ảnh để thêm vào bài đăng</Label>
          <div className="grid grid-cols-2 gap-3">
            {generatedImages.map((image, index) => (
              <div
                key={index}
                onClick={() => toggleImageSelection(index)}
                className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl border-2 border-border transition-all hover:border-primary"
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`Generated ${index + 1}`}
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

          {selectedImages.size > 0 && (
            <Button onClick={addSelectedImages} className="w-full">
              Thêm {selectedImages.size} hình ảnh vào bài đăng
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
