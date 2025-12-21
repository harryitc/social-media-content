"use client"

import { ThumbsUp, MessageCircle, Share2, MoreHorizontal, Smartphone, Monitor } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface PostPreviewProps {
  content: string
  images: string[]
  scheduledTime?: string
}

export function PostPreview({ content, images, scheduledTime }: PostPreviewProps) {
  const [deviceMode, setDeviceMode] = useState<"desktop" | "mobile">("desktop")
  const scheduledDate = scheduledTime ? new Date(scheduledTime) : null
  const hasValidSchedule = scheduledDate && !Number.isNaN(scheduledDate.getTime())
  const scheduleLabel = hasValidSchedule
    ? new Intl.DateTimeFormat("vi-VN", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(scheduledDate)
    : "Đăng ngay sau khi duyệt"

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Xem trước</CardTitle>
          <Tabs value={deviceMode} onValueChange={(v) => setDeviceMode(v as any)}>
            <TabsList className="h-8">
              <TabsTrigger value="desktop" className="h-7 px-2">
                <Monitor className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="mobile" className="h-7 px-2">
                <Smartphone className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            "mx-auto overflow-hidden rounded-xl border border-border bg-white dark:bg-gray-900",
            deviceMode === "mobile" ? "max-w-[375px]" : "w-full",
          )}
        >
          {/* Facebook Post Header */}
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback>HT</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">HUTECH Official</p>
                  {/* <p className="text-xs text-gray-500">
                    {scheduleLabel} · <span className="inline-block">🌐</span>
                  </p> */}
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-5 w-5 text-gray-600" />
              </Button>
            </div>

            {/* Post Content */}
            <div className="mt-3">
              {content ? (
                <p className="whitespace-pre-wrap text-sm text-gray-900 dark:text-white">{content}</p>
              ) : (
                <p className="text-sm text-gray-400 italic">Nội dung bài đăng sẽ hiển thị ở đây...</p>
              )}
            </div>
          </div>

          {/* Post Images */}
          {images.length > 0 && (
            <div
              className={cn(
                "grid gap-0.5 bg-black",
                images.length === 1 && "grid-cols-1",
                images.length === 2 && "grid-cols-2",
                images.length === 3 && "grid-cols-2",
                images.length >= 4 && "grid-cols-2",
              )}
            >
              {images.slice(0, 4).map((image, index) => (
                <div
                  key={index}
                  className={cn(
                    "relative aspect-square overflow-hidden bg-gray-100",
                    images.length === 1 && "aspect-video",
                    images.length === 3 && index === 0 && "col-span-2 aspect-video",
                  )}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Preview ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  {index === 3 && images.length > 4 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                      <span className="text-3xl font-bold text-white">+{images.length - 4}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Post Stats & Actions */}
          <div className="p-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2 text-sm text-gray-500 dark:border-gray-700">
              <div className="flex items-center gap-1">
                <div className="flex -space-x-1">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500">
                    <ThumbsUp className="h-3 w-3 fill-white text-white" />
                  </div>
                </div>
                <span>0</span>
              </div>
              <div className="flex gap-2">
                <span>0 bình luận</span>
                <span>0 chia sẻ</span>
              </div>
            </div>

            <div className="mt-2 grid grid-cols-3 gap-2">
              <Button variant="ghost" className="h-9 text-gray-600 hover:bg-gray-100 dark:text-gray-400">
                <ThumbsUp className="mr-2 h-4 w-4" />
                Thích
              </Button>
              <Button variant="ghost" className="h-9 text-gray-600 hover:bg-gray-100 dark:text-gray-400">
                <MessageCircle className="mr-2 h-4 w-4" />
                Bình luận
              </Button>
              <Button variant="ghost" className="h-9 text-gray-600 hover:bg-gray-100 dark:text-gray-400">
                <Share2 className="mr-2 h-4 w-4" />
                Chia sẻ
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
