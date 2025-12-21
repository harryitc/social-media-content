"use client"

import { useState } from "react"
import { Upload, Search, Filter, Grid3x3, List, ImageIcon, Trash2, Download, Eye, FileText } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const mockImages = [
  {
    id: 1,
    url: "/university-campus.png",
    name: "Tuyển sinh 2024",
    type: "image",
    size: "2.4 MB",
    date: "20/12/2024",
    used: 5,
  },
  {
    id: 2,
    url: "/diverse-students-studying.png",
    name: "Sinh viên HUTECH",
    type: "image",
    size: "1.8 MB",
    date: "19/12/2024",
    used: 3,
  },
  {
    id: 3,
    url: "/vibrant-university-campus.png",
    name: "Khuôn viên trường",
    type: "image",
    size: "3.2 MB",
    date: "18/12/2024",
    used: 8,
  },
  {
    id: 4,
    url: "/graduation.jpg",
    name: "Lễ tốt nghiệp",
    type: "image",
    size: "2.9 MB",
    date: "17/12/2024",
    used: 12,
  },
  {
    id: 5,
    url: "/workshop.png",
    name: "Workshop CNTT",
    type: "image",
    size: "2.1 MB",
    date: "16/12/2024",
    used: 4,
  },
  {
    id: 6,
    url: "/grand-library.png",
    name: "Thư viện hiện đại",
    type: "image",
    size: "2.7 MB",
    date: "15/12/2024",
    used: 6,
  },
]

const mockTemplates = [
  { id: 1, name: "Thông báo tuyển sinh", category: "Marketing", uses: 23 },
  { id: 2, name: "Sự kiện workshop", category: "Sự kiện", uses: 15 },
  { id: 3, name: "Học bổng sinh viên", category: "Giáo dục", uses: 31 },
  { id: 4, name: "Tuyển dụng giảng viên", category: "Tuyển dụng", uses: 8 },
]

export function LibraryContent() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Thư viện nội dung</h1>
          <p className="text-muted-foreground mt-1">Quản lý hình ảnh, template và nội dung đã lưu.</p>
        </div>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Tải lên
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="images" className="space-y-6">
        <TabsList>
          <TabsTrigger value="images">
            <ImageIcon className="mr-2 h-4 w-4" />
            Hình ảnh
          </TabsTrigger>
          <TabsTrigger value="templates">
            <FileText className="mr-2 h-4 w-4" />
            Template
          </TabsTrigger>
        </TabsList>

        <TabsContent value="images" className="space-y-6">
          {/* Filter Bar */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm hình ảnh..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="recent">Gần đây</SelectItem>
                      <SelectItem value="popular">Phổ biến</SelectItem>
                      <SelectItem value="unused">Chưa dùng</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-1 rounded-lg border border-border p-1">
                    <Button
                      variant={viewMode === "grid" ? "secondary" : "ghost"}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid3x3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "secondary" : "ghost"}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images Grid/List */}
          {viewMode === "grid" ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {mockImages.map((image) => (
                <Card key={image.id} className="group overflow-hidden">
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt={image.name}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button size="icon" variant="secondary">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="secondary">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-medium truncate">{image.name}</h4>
                    <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
                      <span>{image.size}</span>
                      <Badge variant="secondary">{image.used} lần</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{image.date}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {mockImages.map((image) => (
                    <div key={image.id} className="flex items-center gap-4 p-4 hover:bg-accent">
                      <img
                        src={image.url || "/placeholder.svg"}
                        alt={image.name}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{image.name}</h4>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span>{image.size}</span>
                          <span>{image.date}</span>
                          <Badge variant="secondary">{image.used} lần dùng</Badge>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Filter className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Xem
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Tải xuống
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          {/* Templates Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mockTemplates.map((template) => (
              <Card key={template.id} className="group cursor-pointer transition-all hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex h-32 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 mb-4">
                    <FileText className="h-12 w-12 text-primary" />
                  </div>
                  <h4 className="font-semibold">{template.name}</h4>
                  <div className="flex items-center justify-between mt-3">
                    <Badge variant="outline">{template.category}</Badge>
                    <span className="text-sm text-muted-foreground">{template.uses} lần dùng</span>
                  </div>
                  <Button variant="outline" className="w-full mt-4 bg-transparent">
                    Sử dụng
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
