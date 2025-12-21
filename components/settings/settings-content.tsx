"use client"

import { useState } from "react"
import { Facebook, Bell, User, Palette } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SettingsContent() {
  const [fbConnected, setFbConnected] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    posts: true,
    comments: true,
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-balance">Thiết lập</h1>
        <p className="text-muted-foreground mt-1">Quản lý cài đặt tài khoản và kết nối.</p>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="account" className="space-y-6">
        <TabsList>
          <TabsTrigger value="account">
            <User className="mr-2 h-4 w-4" />
            Tài khoản
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <Facebook className="mr-2 h-4 w-4" />
            Kết nối
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Thông báo
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="mr-2 h-4 w-4" />
            Giao diện
          </TabsTrigger>
        </TabsList>

        {/* Account Settings */}
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
              <CardDescription>Cập nhật thông tin tài khoản của bạn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fullname">Họ và tên</Label>
                  <Input id="fullname" placeholder="Nguyễn Văn A" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="email@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input id="phone" placeholder="+84 123 456 789" />
              </div>
              <Separator />
              <Button>Lưu thay đổi</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bảo mật</CardTitle>
              <CardDescription>Quản lý mật khẩu và bảo mật tài khoản</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Mật khẩu mới</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Xác thực 2 bước</h4>
                  <p className="text-sm text-muted-foreground">Thêm lớp bảo mật cho tài khoản</p>
                </div>
                <Switch />
              </div>
              <Separator />
              <Button>Cập nhật mật khẩu</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Kết nối Facebook</CardTitle>
              <CardDescription>Quản lý kết nối với tài khoản Facebook của bạn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#1877f2]/10">
                    <Facebook className="h-6 w-6 text-[#1877f2]" />
                  </div>
                  <div>
                    <h4 className="font-medium">Facebook Pages</h4>
                    <p className="text-sm text-muted-foreground">
                      {fbConnected ? "Đã kết nối - HUTECH Fanpage" : "Chưa kết nối"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {fbConnected && <Badge variant="default">Đã kết nối</Badge>}
                  <Button variant={fbConnected ? "outline" : "default"} onClick={() => setFbConnected(!fbConnected)}>
                    {fbConnected ? "Ngắt kết nối" : "Kết nối"}
                  </Button>
                </div>
              </div>

              {fbConnected && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h4 className="font-medium">Trang đã kết nối</h4>
                    <div className="space-y-2">
                      {["HUTECH Official", "HUTECH Student Life", "HUTECH Career"].map((page) => (
                        <div
                          key={page}
                          className="flex items-center justify-between rounded-lg border border-border p-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10" />
                            <span className="font-medium">{page}</span>
                          </div>
                          <Button variant="ghost" size="sm">
                            Quản lý
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Webhook & API</CardTitle>
              <CardDescription>Kết nối với n8n và các công cụ tự động hóa</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="webhook-url">Webhook URL (n8n)</Label>
                <Input id="webhook-url" placeholder="https://your-n8n.com/webhook/..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <div className="flex gap-2">
                  <Input id="api-key" type="password" placeholder="••••••••••••••••" />
                  <Button variant="outline">Tạo mới</Button>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Kích hoạt AI Assistant</h4>
                  <p className="text-sm text-muted-foreground">Sử dụng AI để tạo nội dung và hình ảnh</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <Button>Lưu cấu hình</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt thông báo</CardTitle>
              <CardDescription>Quản lý cách bạn nhận thông báo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Thông báo Email</h4>
                  <p className="text-sm text-muted-foreground">Nhận thông báo qua email</p>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Thông báo đẩy</h4>
                  <p className="text-sm text-muted-foreground">Nhận thông báo trên trình duyệt</p>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                />
              </div>
              <Separator />
              <div className="space-y-4">
                <h4 className="font-medium">Thông báo về</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-posts" className="font-normal">
                      Bài đăng mới được đăng
                    </Label>
                    <Switch
                      id="notify-posts"
                      checked={notifications.posts}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, posts: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-comments" className="font-normal">
                      Bình luận mới
                    </Label>
                    <Switch
                      id="notify-comments"
                      checked={notifications.comments}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, comments: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-schedule" className="font-normal">
                      Nhắc nhở lịch đăng
                    </Label>
                    <Switch id="notify-schedule" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-analytics" className="font-normal">
                      Báo cáo phân tích hàng tuần
                    </Label>
                    <Switch id="notify-analytics" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Giao diện</CardTitle>
              <CardDescription>Tùy chỉnh giao diện ứng dụng</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Chế độ hiển thị</Label>
                <Select defaultValue="system">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Sáng</SelectItem>
                    <SelectItem value="dark">Tối</SelectItem>
                    <SelectItem value="system">Theo hệ thống</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Ngôn ngữ</Label>
                <Select defaultValue="vi">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vi">Tiếng Việt</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Múi giờ</Label>
                <Select defaultValue="asia-hcm">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asia-hcm">Giờ Việt Nam (GMT+7)</SelectItem>
                    <SelectItem value="asia-bangkok">Giờ Bangkok (GMT+7)</SelectItem>
                    <SelectItem value="asia-singapore">Giờ Singapore (GMT+8)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Hiệu ứng chuyển động</h4>
                  <p className="text-sm text-muted-foreground">Bật/tắt animation trong ứng dụng</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
