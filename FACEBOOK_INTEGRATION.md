# Hướng dẫn cấu hình Facebook Pages Integration

## Tổng quan

Tính năng này cho phép:
- Hiển thị danh sách Facebook Pages mà user đang quản lý
- Chọn một Page từ danh sách
- Xem các bài đăng (posts) của Page đã chọn
- Lọc posts theo thời gian (date range hoặc năm)

## Cấu trúc Files

```
lib/
  ├── env.ts              # Đọc & validate environment variables
  └── api.ts              # Axios instance và helpers

types/
  └── facebook.ts         # TypeScript types cho Facebook API

services/
  └── facebook.ts         # Functions gọi Backend API

components/posts/
  ├── page-select.tsx           # Component chọn Facebook Page
  └── manage-posts-content.tsx  # Component chính quản lý posts

.env.local.example        # File mẫu cho environment variables
```

## Cài đặt

### 1. Tạo file .env.local

```bash
cp .env.local.example .env.local
```

### 2. Cấu hình environment variables

Mở file `.env.local` và thay thế các giá trị:

```env
# Backend API Base URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080

# Facebook User Access Token
NEXT_PUBLIC_FACEBOOK_USER_TOKEN=your_facebook_user_access_token_here

# Facebook Graph API Version (optional)
NEXT_PUBLIC_GRAPH_API_VERSION=v19.0
```

**Lấy Facebook User Access Token:**
1. Truy cập [Facebook Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Chọn app của bạn
3. Thêm permissions: `pages_show_list`, `pages_read_engagement`, `pages_read_user_content`
4. Click "Generate Access Token"
5. Copy token và paste vào `.env.local`

### 3. Cài đặt dependencies (nếu cần)

```bash
npm install
# hoặc
pnpm install
```

### 4. Chạy development server

```bash
npm run dev
# hoặc
pnpm dev
```

Mở [http://localhost:3000/posts/manage](http://localhost:3000/posts/manage)

## Luồng hoạt động

### 1. Fetch Pages

Khi component mount:
```typescript
// Gọi: GET /api/facebook/pages
// Headers: Authorization: Bearer <user_token>
const pages = await fetchPages(userToken)
```

Response được chuẩn hoá thành:
```typescript
interface ManagedPage {
  id: string      // Page ID
  name: string    // Page name
  token: string   // Page access token
}
```

### 2. Chọn Page

User chọn một Page từ dropdown (PageSelect component). Component lưu đầy đủ thông tin:
- `selectedPage.id` - để truyền vào API params
- `selectedPage.name` - để hiển thị UI
- `selectedPage.token` - để authenticate với Backend

### 3. Fetch Posts

Khi user chọn page hoặc thay đổi filter:

**Theo date range:**
```typescript
// Gọi: GET /api/facebook/posts?pageId=...&since=...&until=...
// Headers: Authorization: Bearer <page_token>
const response = await fetchPostsByDateRange({
  pageId: selectedPage.id,
  pageToken: selectedPage.token,
  since: "2024-01-01",
  until: "2024-12-31"
})
```

**Theo năm:**
```typescript
// Gọi: GET /api/facebook/posts/by-year?pageId=...&year=...
// Headers: Authorization: Bearer <page_token>
const response = await fetchPostsByYear({
  pageId: selectedPage.id,
  pageToken: selectedPage.token,
  year: 2024
})
```

## Backend API Endpoints

### GET /api/facebook/pages

**Mục đích:** Lấy danh sách Pages mà user quản lý

**Authentication:** 
- Header: `Authorization: Bearer <user_token>`
- hoặc Query param: `?accessToken=<user_token>`

**Response:**
```json
{
  "data": [
    {
      "id": "123456789",
      "name": "My Page Name",
      "access_token": "page_access_token_here"
    }
  ]
}
```

### GET /api/facebook/posts

**Mục đích:** Lấy posts theo date range

**Authentication:** `Authorization: Bearer <page_token>`

**Query params:**
- `pageId` (required)
- `since` (optional): ISO date string (YYYY-MM-DD)
- `until` (optional): ISO date string (YYYY-MM-DD)
- `graphApiVersion` (optional): e.g., "v19.0"

**Response:**
```json
{
  "data": [
    {
      "id": "123456789_987654321",
      "message": "Post content here",
      "created_time": "2024-01-15T10:30:00+0000",
      "likes": { "summary": { "total_count": 42 } },
      "comments": { "summary": { "total_count": 5 } },
      "shares": { "count": 3 }
    }
  ]
}
```

### GET /api/facebook/posts/by-year

**Mục đích:** Lấy posts theo năm

**Authentication:** `Authorization: Bearer <page_token>`

**Query params:**
- `pageId` (required)
- `year` (required): e.g., 2024
- `graphApiVersion` (optional)

**Response:** Giống như `/api/facebook/posts`

## Xử lý lỗi

### Thiếu environment variables

```
❌ Missing required environment variable: NEXT_PUBLIC_FACEBOOK_USER_TOKEN
Vui lòng tạo file .env.local và thêm biến NEXT_PUBLIC_FACEBOOK_USER_TOKEN
Xem .env.local.example để biết chi tiết.
```

**Giải pháp:** Tạo file `.env.local` và thêm các biến cần thiết

### Token không hợp lệ (401)

```
❌ User token không hợp lệ hoặc đã hết hạn
```

**Giải pháp:** 
1. Tạo token mới từ Facebook Graph API Explorer
2. Cập nhật `NEXT_PUBLIC_FACEBOOK_USER_TOKEN` trong `.env.local`
3. Restart dev server

### Backend không phản hồi

```
❌ Không thể lấy danh sách pages: Network Error
```

**Giải pháp:**
1. Kiểm tra Backend đã chạy chưa
2. Kiểm tra `NEXT_PUBLIC_API_BASE_URL` đúng chưa
3. Kiểm tra CORS settings ở Backend

## Bảo mật

### ⚠️ Lưu ý quan trọng

- Token được đặt prefix `NEXT_PUBLIC_*` nên **sẽ bị expose ra client-side**
- Chỉ dùng cách này cho **local development** hoặc **demo**
- **KHÔNG** commit file `.env.local` lên Git

### Giải pháp bảo mật hơn (Production)

Để bảo mật hơn cho production, có thể:

1. **Tạo Next.js API Route làm proxy:**

```typescript
// app/api/facebook-proxy/pages/route.ts
export async function GET() {
  const userToken = process.env.FACEBOOK_USER_TOKEN // Không có NEXT_PUBLIC_
  
  const response = await fetch(
    `${process.env.BACKEND_API_URL}/api/facebook/pages`,
    {
      headers: {
        Authorization: `Bearer ${userToken}`
      }
    }
  )
  
  return Response.json(await response.json())
}
```

2. **Dùng Server Actions (Next.js 14+):**

```typescript
// app/actions/facebook.ts
'use server'

export async function getPages() {
  const userToken = process.env.FACEBOOK_USER_TOKEN
  // ... gọi backend
}
```

3. **Implement OAuth flow:**
- User login qua Facebook OAuth
- Backend lưu token vào session/database
- Frontend không cần biết token

## Troubleshooting

### Component không load pages

**Kiểm tra:**
1. Mở DevTools Console, xem có error không
2. Kiểm tra Network tab, xem request có được gửi không
3. Kiểm tra response từ backend

### Không thấy posts sau khi chọn page

**Kiểm tra:**
1. Page có bài đăng trong khoảng thời gian đã chọn không?
2. Thử thay đổi filter mode về "Tất cả"
3. Kiểm tra page token có permission `pages_read_engagement` không

## Liên hệ & Support

Nếu gặp vấn đề, hãy kiểm tra:
- Console logs (development mode có log chi tiết)
- Network requests trong DevTools
- Backend logs

---

**Happy coding! 🚀**
