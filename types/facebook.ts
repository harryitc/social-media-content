/**
 * Facebook API Type Definitions
 * Định nghĩa types cho Facebook Pages và Posts
 */

/**
 * Facebook Page được quản lý bởi user
 * Chuẩn hoá từ nhiều format response khác nhau từ backend
 */
export interface ManagedPage {
  id: string
  name: string
  token: string // page access token để fetch posts
}

/**
 * Raw response từ API /api/facebook/pages
 * Backend có thể trả về nhiều format khác nhau
 */
export interface PagesApiResponse {
  data?: Array<{
    id?: string
    name?: string
    access_token?: string
    pageToken?: string
    token?: string
  }>
  pages?: Array<{
    id?: string
    name?: string
    access_token?: string
    pageToken?: string
    token?: string
  }>
  paging?: {
    cursors?: {
      before?: string
      after?: string
    }
    next?: string
  }
}

/**
 * Raw post data từ API /api/facebook/posts
 */
export interface RawFacebookPost {
  id?: string
  message?: string
  story?: string
  content?: string
  description?: string
  caption?: string
  created_time?: string
  createdTime?: string
  published_time?: string
  scheduled_publish_time?: string
  updated_time?: string
  status?: string
  state?: string
  postStatus?: string
  full_picture?: string
  picture?: string
  images?: string[]
  attachments?: {
    data?: Array<{
      media?: {
        image?: {
          src?: string
        }
        source?: string
      }
      full_picture?: string
      picture?: string
    }>
  }
  likes?: {
    summary?: {
      total_count?: number
    }
  }
  reactions?: {
    summary?: {
      total_count?: number
    }
  }
  likeCount?: number
  comments?: {
    summary?: {
      total_count?: number
    }
  }
  commentCount?: number
  shares?: {
    count?: number
  }
  shareCount?: number
  engagement?: {
    like?: number
    comment?: number
    share?: number
  }
}

/**
 * Response từ API posts
 */
export interface PostsApiResponse {
  data?: RawFacebookPost[]
  posts?: RawFacebookPost[]
  items?: RawFacebookPost[]
  paging?: {
    cursors?: {
      before?: string
      after?: string
    }
    next?: string
    previous?: string
  }
}

/**
 * Normalized post (đã được chuẩn hoá)
 * Dùng lại type từ post-utils.ts
 */
export interface NormalizedPost {
  id: string
  content: string
  createdAt: string
  status: "published" | "scheduled" | "draft" | "error" | "unknown"
  images: string[]
  interactions: {
    likes: number
    comments: number
    shares: number
  }
}

/**
 * Params để fetch posts theo date range
 */
export interface FetchPostsParams {
  pageId: string
  pageToken: string
  since?: string // ISO date string (YYYY-MM-DD)
  until?: string // ISO date string (YYYY-MM-DD)
  graphApiVersion?: string
}

/**
 * Params để fetch posts theo năm
 */
export interface FetchPostsByYearParams {
  pageId: string
  pageToken: string
  year: number
  graphApiVersion?: string
}
