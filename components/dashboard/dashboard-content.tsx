"use client"

import {
  TrendingUp,
  Heart,
  MessageCircle,
  Share2,
  Clock,
  CalendarIcon,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const stats = [
  {
    title: "Tổng bài đăng",
    value: "248",
    change: "+12.5%",
    trend: "up",
    icon: FileText,
  },
  {
    title: "Tổng tương tác",
    value: "18.6K",
    change: "+23.1%",
    trend: "up",
    icon: TrendingUp,
  },
  {
    title: "Lượt thích",
    value: "12.4K",
    change: "+18.2%",
    trend: "up",
    icon: Heart,
  },
  {
    title: "Bình luận",
    value: "4.2K",
    change: "-5.3%",
    trend: "down",
    icon: MessageCircle,
  },
]

const engagementData = [
  { name: "T2", likes: 400, comments: 240, shares: 100 },
  { name: "T3", likes: 300, comments: 139, shares: 221 },
  { name: "T4", likes: 200, comments: 980, shares: 229 },
  { name: "T5", likes: 278, comments: 390, shares: 200 },
  { name: "T6", likes: 189, comments: 480, shares: 218 },
  { name: "T7", likes: 239, comments: 380, shares: 250 },
  { name: "CN", likes: 349, comments: 430, shares: 210 },
]

const postsPerformance = [
  { name: "Tuần 1", posts: 12 },
  { name: "Tuần 2", posts: 19 },
  { name: "Tuần 3", posts: 15 },
  { name: "Tuần 4", posts: 24 },
]

const recentPosts = [
  {
    id: 1,
    title: "Thông báo tuyển sinh năm học 2024",
    status: "published",
    likes: 1234,
    comments: 56,
    shares: 23,
    time: "2 giờ trước",
  },
  {
    id: 2,
    title: "Hội thảo khoa học công nghệ thông tin",
    status: "scheduled",
    likes: 0,
    comments: 0,
    shares: 0,
    time: "Lên lịch: 15:00 hôm nay",
  },
  {
    id: 3,
    title: "Chúc mừng sinh viên đạt giải thưởng",
    status: "published",
    likes: 892,
    comments: 34,
    shares: 12,
    time: "5 giờ trước",
  },
]

const upcomingSchedule = [
  { id: 1, title: "Bài viết về sự kiện workshop", time: "14:00 - Hôm nay" },
  { id: 2, title: "Thông báo học bổng mới", time: "09:00 - Ngày mai" },
  { id: 3, title: "Tuyển dụng giảng viên", time: "16:00 - 25/12" },
]

export function DashboardContent() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-balance">Tổng quan</h1>
        <p className="text-muted-foreground mt-1">Theo dõi hiệu suất và phân tích xu hướng nội dung.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <Badge variant={stat.trend === "up" ? "default" : "destructive"} className="gap-1">
                  {stat.trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {stat.change}
                </Badge>
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Engagement Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Tương tác 7 ngày qua</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={engagementData}>
                <defs>
                  <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="likes"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#colorLikes)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Posts Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Bài đăng theo tuần</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={postsPerformance}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Bar dataKey="posts" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Posts & Scheduled */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Posts */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Bài đăng gần đây</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/posts">Xem tất cả</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <div key={post.id} className="flex items-start gap-4 rounded-lg border border-border p-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{post.title}</h4>
                      <Badge variant={post.status === "published" ? "default" : "secondary"}>
                        {post.status === "published" ? "Đã đăng" : "Đã lên lịch"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.time}
                    </p>
                    {post.status === "published" && (
                      <div className="flex items-center gap-4 mt-3 text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Heart className="h-4 w-4" />
                          {post.likes}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <MessageCircle className="h-4 w-4" />
                          {post.comments}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Share2 className="h-4 w-4" />
                          {post.shares}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Lịch đăng sắp tới</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingSchedule.map((item) => (
                <div key={item.id} className="flex gap-3 items-start">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/calendar">Xem lịch đầy đủ</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Thao tác nhanh</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button asChild className="h-auto flex-col gap-2 py-6">
              <Link href="/posts/create">
                <FileText className="h-6 w-6" />
                <span>Tạo bài đăng</span>
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-auto flex-col gap-2 py-6 bg-transparent">
              <Link href="/calendar">
                <CalendarIcon className="h-6 w-6" />
                <span>Xem lịch đăng</span>
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-auto flex-col gap-2 py-6 bg-transparent">
              <Link href="/library">
                <FileText className="h-6 w-6" />
                <span>Thư viện</span>
              </Link>
            </Button>
            <Button variant="outline" asChild className="h-auto flex-col gap-2 py-6 bg-transparent">
              <Link href="/posts">
                <TrendingUp className="h-6 w-6" />
                <span>Phân tích</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
