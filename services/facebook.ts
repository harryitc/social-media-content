/**
 * Facebook API Service
 * Các functions để gọi Backend API (Java Spring Boot)
 */

import { getApiClient, withBearerToken, buildQueryParams } from "@/lib/api"
import { getEnvConfig } from "@/lib/env"
import type {
  ManagedPage,
  PagesApiResponse,
  PostsApiResponse,
  FetchPostsParams,
  FetchPostsByYearParams,
} from "@/types/facebook"

/**
 * Normalize pages từ nhiều format response khác nhau
 * Backend có thể trả: { data: [...] } hoặc { pages: [...] }
 * Mỗi page item có thể có: access_token, pageToken, hoặc token
 */
function normalizePages(response: PagesApiResponse): ManagedPage[] {
  // Tìm array chứa pages
  const rawPages =
    (Array.isArray(response?.data) && response.data) ||
    (Array.isArray(response?.pages) && response.pages) ||
    (Array.isArray(response) && response) ||
    []

  return rawPages
    .map((page) => {
      const id = page?.id
      const name = page?.name
      const token = page?.access_token || page?.pageToken || page?.token

      if (!id || !name || !token) {
        console.warn("⚠️ Page thiếu thông tin:", page)
        return null
      }

      return {
        id: String(id),
        name: String(name),
        token: String(token),
      } as ManagedPage
    })
    .filter((page): page is ManagedPage => page !== null)
}

/**
 * Fetch danh sách Facebook Pages mà user đang quản lý
 * Gọi: GET /api/facebook/pages
 * Cần: User Access Token (Authorization: Bearer <user_token>)
 * 
 * @param userToken - User access token (nếu không truyền thì lấy từ env)
 * @returns Array of ManagedPage
 */
export async function fetchPages(userToken?: string): Promise<ManagedPage[]> {
  try {
    const token = userToken || getEnvConfig().facebookUserToken
    
    if (!token) {
      throw new Error("User access token không được cung cấp")
    }

    const client = getApiClient()
    
    // Gọi API với Authorization header
    const response = await client.get<PagesApiResponse>(
      "/api/facebook/pages",
      withBearerToken(token)
    )

    const pages = normalizePages(response.data)
    
    if (pages.length === 0) {
      console.warn("⚠️ Không tìm thấy page nào từ API")
    }

    return pages
  } catch (error: any) {
    console.error("❌ Error fetching pages:", error.message)
    
    if (error.response?.status === 401) {
      throw new Error("User token không hợp lệ hoặc đã hết hạn. Vui lòng kiểm tra lại NEXT_PUBLIC_FACEBOOK_USER_TOKEN")
    }
    
    if (error.response?.status === 400) {
      throw new Error(`Bad request: ${error.response?.data?.message || error.message}`)
    }
    
    throw new Error(`Không thể lấy danh sách pages: ${error.message}`)
  }
}

/**
 * Fetch posts theo date range
 * Gọi: GET /api/facebook/posts?pageId=...&since=...&until=...
 * Cần: Page Access Token (Authorization: Bearer <page_token>)
 * 
 * @param params - FetchPostsParams
 * @returns PostsApiResponse
 */
export async function fetchPostsByDateRange(params: FetchPostsParams): Promise<PostsApiResponse> {
  try {
    const { pageId, pageToken, since, until, graphApiVersion } = params
    
    if (!pageId || !pageToken) {
      throw new Error("pageId và pageToken là bắt buộc")
    }

    const client = getApiClient()
    const queryParams = buildQueryParams({
      pageId,
      since,
      until,
      graphApiVersion: graphApiVersion || getEnvConfig().graphApiVersion,
    })

    // Gọi API với page token trong Authorization header
    const response = await client.get<PostsApiResponse>(
      `/api/facebook/posts?${queryParams.toString()}`,
      withBearerToken(pageToken)
    )

    return response.data
  } catch (error: any) {
    console.error("❌ Error fetching posts:", error.message)
    
    if (error.response?.status === 401) {
      throw new Error("Page token không hợp lệ hoặc đã hết hạn")
    }
    
    if (error.response?.status === 400) {
      throw new Error(`Bad request: ${error.response?.data?.message || error.message}`)
    }
    
    throw new Error(`Không thể lấy danh sách posts: ${error.message}`)
  }
}

/**
 * Fetch posts theo năm
 * Gọi: GET /api/facebook/posts/by-year?pageId=...&year=...
 * Cần: Page Access Token (Authorization: Bearer <page_token>)
 * 
 * @param params - FetchPostsByYearParams
 * @returns PostsApiResponse
 */
export async function fetchPostsByYear(params: FetchPostsByYearParams): Promise<PostsApiResponse> {
  try {
    const { pageId, pageToken, year, graphApiVersion } = params
    
    if (!pageId || !pageToken || !year) {
      throw new Error("pageId, pageToken và year là bắt buộc")
    }

    const client = getApiClient()
    const queryParams = buildQueryParams({
      pageId,
      year,
      graphApiVersion: graphApiVersion || getEnvConfig().graphApiVersion,
    })

    // Gọi API với page token trong Authorization header
    const response = await client.get<PostsApiResponse>(
      `/api/facebook/posts/by-year?${queryParams.toString()}`,
      withBearerToken(pageToken)
    )

    return response.data
  } catch (error: any) {
    console.error("❌ Error fetching posts by year:", error.message)
    
    if (error.response?.status === 401) {
      throw new Error("Page token không hợp lệ hoặc đã hết hạn")
    }
    
    if (error.response?.status === 400) {
      throw new Error(`Bad request: ${error.response?.data?.message || error.message}`)
    }
    
    throw new Error(`Không thể lấy danh sách posts theo năm: ${error.message}`)
  }
}
