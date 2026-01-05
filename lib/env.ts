/**
 * Environment Variables Configuration
 * Đọc và validate các environment variables cần thiết cho Facebook API integration
 */

interface EnvConfig {
  apiBaseUrl: string
  facebookUserToken: string
  graphApiVersion: string
}

function getEnvVariable(key: string, required: boolean = true): string {
  // Đọc trực tiếp từ process.env thay vì dùng destructuring
  // để Next.js có thể thay thế lúc build time
  let value = ""
  if (key === "NEXT_PUBLIC_API_BASE_URL") {
    value = process.env.NEXT_PUBLIC_API_BASE_URL || ""
  } else if (key === "NEXT_PUBLIC_FACEBOOK_USER_TOKEN") {
    value = process.env.NEXT_PUBLIC_FACEBOOK_USER_TOKEN || ""
  } else if (key === "NEXT_PUBLIC_GRAPH_API_VERSION") {
    value = process.env.NEXT_PUBLIC_GRAPH_API_VERSION || ""
  }
  
  if (required && !value) {
    throw new Error(
      `❌ Missing required environment variable: ${key}\n` +
      `Vui lòng tạo file .env.local và thêm biến ${key}\n` +
      `Xem .env.local.example để biết chi tiết.`
    )
  }
  
  return value || ""
}

/**
 * Lấy tất cả environment variables cần thiết
 * Throw error rõ ràng nếu thiếu biến bắt buộc
 */
export function getEnvConfig(): EnvConfig {
  return {
    apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "",
    facebookUserToken: process.env.NEXT_PUBLIC_FACEBOOK_USER_TOKEN || "",
    graphApiVersion: process.env.NEXT_PUBLIC_GRAPH_API_VERSION || "v19.0",
  }
}

/**
 * Validate env config khi app khởi động
 */
export function validateEnv(): void {
  try {
    const config = getEnvConfig()
    
    if (!config.apiBaseUrl.startsWith("http")) {
      throw new Error(
        `NEXT_PUBLIC_API_BASE_URL phải bắt đầu bằng http:// hoặc https://\n` +
        `Giá trị hiện tại: ${config.apiBaseUrl}`
      )
    }
    
    // Không log token ra console trong production
    if (process.env.NODE_ENV === "development") {
      console.log("✅ Environment variables đã được load thành công")
      console.log("📍 API Base URL:", config.apiBaseUrl)
      console.log("🔑 User Token:", config.facebookUserToken ? "***" + config.facebookUserToken.slice(-8) : "MISSING")
      console.log("📊 Graph API Version:", config.graphApiVersion)
    }
  } catch (error) {
    console.error("❌ Environment validation failed:", error)
    throw error
  }
}
