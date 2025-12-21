"use client"

import { MoreHorizontal, ThumbsUp, MessageCircle, Share2, Eye, Edit, Copy, Repeat, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import Image from "next/image"

const mockPosts = [
  {
    id: 1,
    content: "Chào mừng các bạn sinh viên mới nhập học năm 2025! 🎓 HUTECH tự hào đón chào thế hệ tài năng...",
    images: ["/diverse-students-studying.png"],
    imageCount: 3,
    status: "published",
    publishedAt: "2 giờ trước",
    platform: "facebook",
    stats: { likes: 1243, comments: 89, shares: 45 },
  },
  {
    id: 2,
    content: "Thông báo về lịch thi cuối kỳ học kỳ 1 năm học 2024-2025 📚",
    images: [],
    imageCount: 0,
    status: "scheduled",
    publishedAt: "2 ngày nữa",
    platform: "facebook",
    stats: { likes: 0, comments: 0, shares: 0 },
  },
  {
    id: 3,
    content: "Hội thảo về AI và Machine Learning - Đăng ký ngay để không bỏ lỡ! 🤖",
    images: ["/ai-conference.jpg"],
    imageCount: 1,
    status: "published",
    publishedAt: "1 ngày trước",
    platform: "facebook",
    stats: { likes: 892, comments: 156, shares: 78 },
  },
  {
    id: 4,
    content: "Chương trình học bổng toàn phần cho sinh viên xuất sắc...",
    images: ["/scholarship-concept.png"],
    imageCount: 2,
    status: "draft",
    publishedAt: "Nháp",
    platform: "facebook",
    stats: { likes: 0, comments: 0, shares: 0 },
  },
  {
    id: 5,
    content: "Cuộc thi khởi nghiệp 2025 - Giải thưởng lên đến 100 triệu đồng! 💡",
    images: [],
    imageCount: 0,
    status: "error",
    publishedAt: "Lỗi đăng",
    platform: "facebook",
    stats: { likes: 0, comments: 0, shares: 0 },
  },
]

const statusConfig = {
  published: { label: "Đã đăng", className: "bg-green-100 text-green-700 hover:bg-green-100" },
  scheduled: { label: "Đã lên lịch", className: "bg-purple-100 text-purple-700 hover:bg-purple-100" },
  draft: { label: "Nháp", className: "bg-gray-100 text-gray-700 hover:bg-gray-100" },
  error: { label: "Lỗi đăng", className: "bg-red-100 text-red-700 hover:bg-red-100" },
}

export function PostsTable({ viewMode }: { viewMode: "table" | "grid" }) {
  if (viewMode === "grid") {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockPosts.map((post) => (
          <Card key={post.id} className="overflow-hidden transition-all hover:shadow-lg">
            {post.images.length > 0 && (
              <div className="relative aspect-video overflow-hidden bg-muted">
                <Image src={post.images[0] || "/placeholder.svg"} alt="Post thumbnail" fill className="object-cover" />
                {post.imageCount > 1 && <Badge className="absolute right-2 top-2">+{post.imageCount - 1}</Badge>}
              </div>
            )}
            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <p className="line-clamp-2 text-sm">{post.content}</p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      Xem chi tiết
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="mr-2 h-4 w-4" />
                      Nhân bản
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Repeat className="mr-2 h-4 w-4" />
                      Đăng lại
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Xóa
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center gap-2">
                <Badge className={statusConfig[post.status as keyof typeof statusConfig].className}>
                  {statusConfig[post.status as keyof typeof statusConfig].label}
                </Badge>
                <span className="text-xs text-muted-foreground">{post.publishedAt}</span>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{post.stats.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{post.stats.comments}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Share2 className="h-4 w-4" />
                  <span>{post.stats.shares}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">Ảnh</TableHead>
            <TableHead>Nội dung</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Thời gian</TableHead>
            <TableHead>Tương tác</TableHead>
            <TableHead className="w-[60px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockPosts.map((post) => (
            <TableRow key={post.id}>
              <TableCell>
                {post.images.length > 0 ? (
                  <div className="relative h-12 w-12 overflow-hidden rounded-lg">
                    <Image
                      src={post.images[0] || "/placeholder.svg"}
                      alt="Post thumbnail"
                      fill
                      className="object-cover"
                    />
                    {post.imageCount > 1 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs text-white font-medium">
                        +{post.imageCount - 1}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-12 w-12 rounded-lg bg-muted" />
                )}
              </TableCell>
              <TableCell className="max-w-md">
                <p className="line-clamp-2 text-sm">{post.content}</p>
              </TableCell>
              <TableCell>
                <Badge className={statusConfig[post.status as keyof typeof statusConfig].className}>
                  {statusConfig[post.status as keyof typeof statusConfig].label}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">{post.publishedAt}</span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4 text-blue-500" />
                    <span>{post.stats.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4 text-green-500" />
                    <span>{post.stats.comments}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Share2 className="h-4 w-4 text-purple-500" />
                    <span>{post.stats.shares}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      Xem chi tiết
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="mr-2 h-4 w-4" />
                      Nhân bản
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Repeat className="mr-2 h-4 w-4" />
                      Đăng lại
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Xóa
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
