/**
 * API Client Configuration
 * Axios instance và helper functions để gọi Backend API
 */

import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios"
import { getEnvConfig } from "./env"

let apiClient: AxiosInstance | null = null

/**
 * Tạo axios instance với baseURL từ env
 */
export function getApiClient(): AxiosInstance {
  if (!apiClient) {
    const config = getEnvConfig()
    
    apiClient = axios.create({
      baseURL: config.apiBaseUrl,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    })
    
    // Interceptor để log request trong development (không log token)
    if (process.env.NODE_ENV === "development") {
      apiClient.interceptors.request.use((config) => {
        const url = config.url || ""
        const method = (config.method || "get").toUpperCase()
        console.log(`🌐 API Request: ${method} ${url}`)
        return config
      })
      
      apiClient.interceptors.response.use(
        (response) => {
          console.log(`✅ API Response: ${response.status} ${response.config.url}`)
          return response
        },
        (error) => {
          console.error(`❌ API Error: ${error.message}`)
          return Promise.reject(error)
        }
      )
    }
  }
  
  return apiClient
}

/**
 * Helper: tạo config với Authorization header (Bearer token)
 */
export function withBearerToken(token: string, config?: AxiosRequestConfig): AxiosRequestConfig {
  return {
    ...config,
    headers: {
      ...config?.headers,
      Authorization: `Bearer ${token}`,
    },
  }
}

/**
 * Helper: tạo query params từ object, bỏ qua undefined/null
 */
export function buildQueryParams(params: Record<string, any>): URLSearchParams {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value))
    }
  })
  
  return searchParams
}
