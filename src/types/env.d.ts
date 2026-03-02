/**
 * 环境变量类型定义
 */

declare global {
  // 应用版本号（构建时注入）
  var __APP_VERSION__: string

  // 构建时间（构建时注入）
  var __BUILD_TIME__: string
}

// 扩展 ImportMeta 类型
interface ImportMetaEnv {
  VITE_ENV: 'development' | 'preview' | 'production'
  VITE_API_BASE_URL?: string
  VITE_SUPABASE_URL?: string
  VITE_SUPABASE_ANON_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

export {}
