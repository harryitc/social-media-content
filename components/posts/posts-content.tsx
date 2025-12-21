"use client"

import { useState } from "react"
import { Plus, Download, LayoutGrid, List, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StatsCards } from "@/components/posts/stats-cards"
import { PostsTable } from "@/components/posts/posts-table"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { ExportReportDialog } from "@/components/posts/export-report-dialog"

export function PostsContent() {
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [showExportDialog, setShowExportDialog] = useState(false)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-balance text-3xl font-bold tracking-tight">Bài đăng</h1>
          <p className="text-pretty text-muted-foreground mt-1">Theo dõi hiệu suất và quản lý nội dung Facebook.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setShowExportDialog(true)}>
            <Download className="mr-2 h-4 w-4" />
            Xuất báo cáo
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tạo bài đăng
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {/* <StatsCards /> */}

      {/* Filters */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="search" placeholder="Tìm theo nội dung / hashtag..." className="pl-9" />
            </div>

            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="published">Đã đăng</SelectItem>
                <SelectItem value="scheduled">Đã lên lịch</SelectItem>
                <SelectItem value="draft">Nháp</SelectItem>
                <SelectItem value="error">Lỗi đăng</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Chủ đề" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="education">Giáo dục</SelectItem>
                <SelectItem value="event">Sự kiện</SelectItem>
                <SelectItem value="inspiration">Truyền cảm hứng</SelectItem>
                <SelectItem value="other">Khác</SelectItem>
              </SelectContent>
            </Select>

            <DatePickerWithRange />

            <Select defaultValue="engagement">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="engagement">Tương tác cao nhất</SelectItem>
                <SelectItem value="newest">Mới nhất</SelectItem>
                <SelectItem value="oldest">Cũ nhất</SelectItem>
              </SelectContent>
            </Select>

            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
              <TabsList>
                <TabsTrigger value="table">
                  <List className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="grid">
                  <LayoutGrid className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Posts List/Grid */}
      <PostsTable viewMode={viewMode} />

      {/* Export Report Dialog */}
      <ExportReportDialog open={showExportDialog} onOpenChange={setShowExportDialog} />
    </div>
  )
}
