"use client"

import { useState } from "react"
import { Save, Send, Clock, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PostEditor } from "@/components/posts/post-editor"
import { PostPreview } from "@/components/posts/post-preview"
import { useToast } from "@/hooks/use-toast"
import { submitPostNow } from "@/lib/ai-service"

export function CreatePostContent() {
  const [postContent, setPostContent] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [scheduledTime, setScheduledTime] = useState("")
  const [mobileTab, setMobileTab] = useState<"editor" | "preview">("editor")
  const [isPublishing, setIsPublishing] = useState(false)
  const { toast } = useToast()

  const hasContent = postContent.trim().length > 0
  const hasSchedule = Boolean(scheduledTime)

  const handleSaveDraft = () => {
    toast({ title: "Đã lưu nháp", description: "Bản nháp đã được lưu tạm thời." })
  }

  const handleSchedulePost = () => {
    if (!hasContent || !hasSchedule) {
      toast({
        title: "Thiếu thông tin",
        description: !hasContent
          ? "Vui lòng nhập nội dung trước khi lên lịch."
          : "Vui lòng chọn thời gian đăng trước khi lên lịch.",
        variant: "destructive",
      })
      return
    }
    toast({ title: "Đã lên lịch", description: "Bài viết sẽ đăng theo thời gian đã chọn." })
  }

  const handlePublishNow = async () => {
    if (!hasContent) {
      toast({
        title: "Thiếu nội dung",
        description: "Vui lòng nhập nội dung trước khi đăng.",
        variant: "destructive",
      })
      return
    }
    setIsPublishing(true)
    try {
      await submitPostNow({ content: postContent.trim(), files: images })
      toast({ title: "Đã gửi yêu cầu đăng", description: "Bài viết đang được xử lý để đăng ngay." })
    } catch (error) {
      console.error(error)
      toast({
        title: "Đăng thất bại",
        description: "Không thể gửi yêu cầu đăng ngay. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-balance text-3xl font-bold tracking-tight">Tạo bài đăng</h1>
          <p className="text-pretty text-muted-foreground mt-1">
            Soạn nội dung, thêm hình ảnh và lên lịch đăng bài của bạn.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleSaveDraft}>
            <Save className="mr-2 h-4 w-4" />
            Lưu nháp
          </Button>
          <Button variant="outline" onClick={handleSchedulePost}>
            <Clock className="mr-2 h-4 w-4" />
            Lên lịch đăng
          </Button>
          <Button onClick={handlePublishNow} disabled={isPublishing}>
            {isPublishing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Đang đăng...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Đăng ngay
              </>
            )}
          </Button>
        </div>
      </div>

      {/* <Alert className="border-primary/50 bg-primary/5">
        <AlertDescription className="text-sm">
          💡 Nếu không chọn thời gian, bài sẽ tự động đăng sau <strong>30 phút</strong>.
        </AlertDescription>
      </Alert> */}

      {/* Mobile Tabs */}
      <div className="lg:hidden">
        <Tabs value={mobileTab} onValueChange={(v) => setMobileTab(v as any)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="editor">Soạn thảo</TabsTrigger>
            <TabsTrigger value="preview">Xem trước</TabsTrigger>
          </TabsList>
          <TabsContent value="editor" className="mt-6">
            <PostEditor
              content={postContent}
              onContentChange={setPostContent}
              images={images}
              onImagesChange={setImages}
              scheduledTime={scheduledTime}
              onScheduledTimeChange={setScheduledTime}
            />
          </TabsContent>
          <TabsContent value="preview" className="mt-6">
            <PostPreview
              content={postContent}
              images={images}
              scheduledTime={scheduledTime}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Desktop Two Column */}
      <div className="hidden lg:grid lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-7">
          <PostEditor
            content={postContent}
            onContentChange={setPostContent}
            images={images}
            onImagesChange={setImages}
            scheduledTime={scheduledTime}
            onScheduledTimeChange={setScheduledTime}
          />
        </div>
        <div className="lg:col-span-5">
          <div className="sticky top-24">
            <PostPreview
              content={postContent}
              images={images}
              scheduledTime={scheduledTime}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
