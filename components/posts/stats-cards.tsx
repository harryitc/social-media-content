"use client"

import { TrendingUp, TrendingDown, FileText, ThumbsUp, MessageCircle, Share2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const stats = [
  {
    title: "Tổng bài đăng",
    value: "145",
    change: "+12.5%",
    trending: "up",
    icon: FileText,
  },
  {
    title: "Tổng lượt thích",
    value: "12.5K",
    change: "+18.2%",
    trending: "up",
    icon: ThumbsUp,
  },
  {
    title: "Tổng bình luận",
    value: "3.2K",
    change: "-5.1%",
    trending: "down",
    icon: MessageCircle,
  },
  {
    title: "Tổng chia sẻ",
    value: "1.8K",
    change: "+23.4%",
    trending: "up",
    icon: Share2,
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        const TrendIcon = stat.trending === "up" ? TrendingUp : TrendingDown

        return (
          <Card key={stat.title} className="overflow-hidden transition-all hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                  <div className="flex items-center gap-1 text-sm">
                    <TrendIcon className={`h-4 w-4 ${stat.trending === "up" ? "text-green-500" : "text-red-500"}`} />
                    <span className={`font-medium ${stat.trending === "up" ? "text-green-600" : "text-red-600"}`}>
                      {stat.change}
                    </span>
                    <span className="text-muted-foreground">so với 7 ngày trước</span>
                  </div>
                </div>
                <div className="rounded-xl bg-primary/10 p-3">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
