"use client"

import { useState } from "react"
import { Download, FileText, FileSpreadsheet, FileCheck, TrendingUp, Users, BarChart3 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ExportReportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ExportReportDialog({ open, onOpenChange }: ExportReportDialogProps) {
  const [reportType, setReportType] = useState("overview")
  const [format, setFormat] = useState("pdf")
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["engagement", "reach", "growth"])

  const reportTypes = [
    {
      id: "overview",
      label: "Tổng quan hiệu suất",
      description: "Báo cáo tổng hợp về tất cả các bài đăng",
      icon: BarChart3,
    },
    {
      id: "detailed",
      label: "Chi tiết từng bài",
      description: "Phân tích sâu từng bài đăng cụ thể",
      icon: FileText,
    },
    {
      id: "engagement",
      label: "Phân tích tương tác",
      description: "Tập trung vào likes, comments, shares",
      icon: TrendingUp,
    },
    {
      id: "audience",
      label: "Phân tích đối tượng",
      description: "Thống kê về độ tuổi, giới tính, vị trí",
      icon: Users,
    },
  ]

  const formats = [
    { id: "pdf", label: "PDF", description: "Định dạng đọc & in", icon: FileText },
    { id: "excel", label: "Excel", description: "Phân tích & chỉnh sửa", icon: FileSpreadsheet },
    { id: "csv", label: "CSV", description: "Dữ liệu thô xuất ra", icon: FileCheck },
  ]

  const metrics = [
    { id: "engagement", label: "Tương tác", description: "Likes, comments, shares" },
    { id: "reach", label: "Tiếp cận", description: "Số người xem" },
    { id: "growth", label: "Tăng trưởng", description: "So sánh theo thời gian" },
    { id: "bestTime", label: "Thời điểm tốt nhất", description: "Phân tích khung giờ" },
    { id: "topPosts", label: "Bài đăng nổi bật", description: "Top 10 bài có hiệu suất cao" },
    { id: "hashtags", label: "Hashtag hiệu quả", description: "Phân tích hashtag" },
  ]

  const toggleMetric = (metricId: string) => {
    setSelectedMetrics((prev) => (prev.includes(metricId) ? prev.filter((id) => id !== metricId) : [...prev, metricId]))
  }

  const handleExport = () => {
    // Logic xuất báo cáo ở đây
    console.log("[v0] Xuất báo cáo:", { reportType, format, selectedMetrics })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Xuất báo cáo</DialogTitle>
          <DialogDescription>Tùy chỉnh báo cáo phân tích hiệu suất bài đăng của bạn</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Loại báo cáo */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Loại báo cáo</Label>
            <RadioGroup value={reportType} onValueChange={setReportType}>
              <div className="grid gap-3 sm:grid-cols-2">
                {reportTypes.map((type) => {
                  const Icon = type.icon
                  return (
                    <label key={type.id} htmlFor={type.id} className="cursor-pointer">
                      <Card
                        className={`p-4 transition-all hover:shadow-md ${
                          reportType === type.id ? "border-primary ring-2 ring-primary/20" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <RadioGroupItem value={type.id} id={type.id} className="mt-1" />
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4 text-primary" />
                              <span className="font-medium">{type.label}</span>
                            </div>
                            <p className="text-pretty text-xs text-muted-foreground">{type.description}</p>
                          </div>
                        </div>
                      </Card>
                    </label>
                  )
                })}
              </div>
            </RadioGroup>
          </div>

          {/* Khoảng thời gian */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Khoảng thời gian</Label>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Select defaultValue="custom">
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">7 ngày qua</SelectItem>
                  <SelectItem value="30days">30 ngày qua</SelectItem>
                  <SelectItem value="90days">90 ngày qua</SelectItem>
                  <SelectItem value="thisMonth">Tháng này</SelectItem>
                  <SelectItem value="lastMonth">Tháng trước</SelectItem>
                  <SelectItem value="custom">Tùy chỉnh</SelectItem>
                </SelectContent>
              </Select>
              <DatePickerWithRange />
            </div>
          </div>

          {/* Định dạng xuất */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Định dạng xuất</Label>
            <div className="grid gap-3 sm:grid-cols-3">
              {formats.map((fmt) => {
                const Icon = fmt.icon
                return (
                  <label key={fmt.id} htmlFor={`format-${fmt.id}`} className="cursor-pointer">
                    <Card
                      className={`p-4 transition-all hover:shadow-md ${
                        format === fmt.id ? "border-primary ring-2 ring-primary/20" : ""
                      }`}
                      onClick={() => setFormat(fmt.id)}
                    >
                      <div className="flex flex-col items-center gap-2 text-center">
                        <Icon className={`h-8 w-8 ${format === fmt.id ? "text-primary" : "text-muted-foreground"}`} />
                        <div className="space-y-1">
                          <p className="font-medium">{fmt.label}</p>
                          <p className="text-xs text-muted-foreground">{fmt.description}</p>
                        </div>
                      </div>
                    </Card>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Lọc dữ liệu */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Lọc dữ liệu</Label>
            <div className="grid gap-3 sm:grid-cols-2">
              <Select defaultValue="all-status">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-status">Tất cả trạng thái</SelectItem>
                  <SelectItem value="published">Chỉ bài đã đăng</SelectItem>
                  <SelectItem value="scheduled">Chỉ bài đã lên lịch</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all-topics">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-topics">Tất cả chủ đề</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="education">Giáo dục</SelectItem>
                  <SelectItem value="event">Sự kiện</SelectItem>
                  <SelectItem value="inspiration">Truyền cảm hứng</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Chỉ số đưa vào báo cáo */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Chỉ số đưa vào báo cáo</Label>
              <Badge variant="secondary">{selectedMetrics.length} đã chọn</Badge>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {metrics.map((metric) => (
                <Card
                  key={metric.id}
                  className={`p-4 transition-all cursor-pointer hover:shadow-md ${
                    selectedMetrics.includes(metric.id) ? "border-primary ring-2 ring-primary/20" : ""
                  }`}
                  onClick={() => toggleMetric(metric.id)}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id={metric.id}
                      checked={selectedMetrics.includes(metric.id)}
                      onCheckedChange={() => toggleMetric(metric.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 space-y-1">
                      <Label htmlFor={metric.id} className="font-medium cursor-pointer">
                        {metric.label}
                      </Label>
                      <p className="text-pretty text-xs text-muted-foreground">{metric.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Preview thông tin báo cáo */}
          <Card className="border-primary/20 bg-primary/5 p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="font-medium">Báo cáo sẽ bao gồm:</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• {reportTypes.find((t) => t.id === reportType)?.label}</li>
                  <li>• {selectedMetrics.length} chỉ số phân tích</li>
                  <li>• Xuất dưới định dạng {formats.find((f) => f.id === format)?.label}</li>
                  <li>• Khoảng thời gian đã chọn</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleExport} disabled={selectedMetrics.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Xuất báo cáo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
