# 🚀 Quick Start - Facebook Pages Integration

## Bước 1: Cấu hình Environment Variables

```bash
# Tạo file .env.local từ example
cp .env.local.example .env.local
```

Mở `.env.local` và điền:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_FACEBOOK_USER_TOKEN=<your_facebook_user_token>
NEXT_PUBLIC_GRAPH_API_VERSION=v19.0
```

## Bước 2: Lấy Facebook User Token

1. Truy cập: https://developers.facebook.com/tools/explorer/
2. Chọn app của bạn
3. Thêm permissions:
   - `pages_show_list`
   - `pages_read_engagement`
   - `pages_read_user_content`
4. Click "Generate Access Token"
5. Copy token và paste vào `.env.local`

## Bước 3: Chạy Backend (Java Spring Boot)

Đảm bảo backend đang chạy ở `http://localhost:8080`

## Bước 4: Chạy Frontend

```bash
# Cài đặt dependencies (nếu cần)
npm install

# Chạy dev server
npm run dev
```

## Bước 5: Mở Browser

Truy cập: http://localhost:3000/posts/manage

## ✅ Kiểm tra

Bạn sẽ thấy:
1. **Dropdown chọn Facebook Page** - Tự động load danh sách pages
2. **Filters** - Chọn thời gian (all/year/range)
3. **Bảng posts** - Hiển thị bài đăng của page đã chọn
4. **Thống kê** - Tổng likes, comments, shares

## 🔥 Features

- ✅ Tự động load danh sách Facebook Pages khi mở trang
- ✅ Chọn page từ dropdown (combobox với search)
- ✅ Tự động fetch posts khi chọn page
- ✅ Filter posts theo: Tất cả / Năm / Khoảng thời gian
- ✅ Hiển thị thống kê tương tác
- ✅ View chi tiết bài đăng
- ✅ Pagination cho danh sách posts
- ✅ Xử lý lỗi rõ ràng

## 🐛 Troubleshooting

**Không thấy pages?**
- Kiểm tra token có đúng không
- Kiểm tra backend đã chạy chưa
- Mở Console để xem error

**Không thấy posts?**
- Page có bài đăng trong khoảng thời gian đã chọn không?
- Thử đổi filter sang "Tất cả"

**Error 401?**
- Token đã hết hạn, tạo token mới

## 📚 Docs đầy đủ

Xem [FACEBOOK_INTEGRATION.md](./FACEBOOK_INTEGRATION.md) để biết chi tiết về:
- Architecture
- API endpoints
- Security considerations
- Advanced configuration

---

**Made with ❤️ by Senior Frontend Engineer**
