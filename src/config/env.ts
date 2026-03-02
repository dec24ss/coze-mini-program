/**
 * 环境配置
 * 用于统一管理开发、测试、生产环境的差异
 */

import Taro from '@tarojs/taro'

// 环境类型
export type EnvType = 'development' | 'preview' | 'production'

// 环境信息接口
export interface EnvInfo {
  type: EnvType
  version: string
  buildTime: string
  apiBaseUrl: string
  enableDebug: boolean
  isLocalDev: boolean  // 是否是本地开发环境
}

// 获取当前环境
export function getEnvInfo(): EnvInfo {
  // 通过小程序环境变量判断
  let envType: EnvType = 'production'

  // 获取小程序环境信息
  try {
    const accountInfo = Taro.getAccountInfoSync()
    if (accountInfo && accountInfo.miniProgram) {
      // development: 开发版
      // trial: 体验版
      // release: 正式版
      const envVersion = accountInfo.miniProgram.envVersion
      if (envVersion === 'develop') {
        envType = 'development'
      } else if (envVersion === 'trial') {
        envType = 'preview'
      } else if (envVersion === 'release') {
        envType = 'production'
      }
    }
  } catch (error) {
    console.log('无法获取小程序环境信息，使用默认值')
  }

  // 判断是否是本地开发（通过检测域名或环境变量）
  const isLocalDev = envType === 'development' ||
    typeof window !== 'undefined' &&
    window.location &&
    (window.location.hostname === 'localhost' ||
     window.location.hostname === '127.0.0.1')

  return {
    type: envType,
    version: getAppVersion(),
    buildTime: getBuildTime(),
    apiBaseUrl: getApiBaseUrl(envType),
    enableDebug: envType !== 'production',
    isLocalDev
  }
}

// 获取应用版本号
export function getAppVersion(): string {
  // 从 package.json 读取版本号
  // 在小程序环境中，我们硬编码版本号
  return '1.0.0'
}

// 获取构建时间
export function getBuildTime(): string {
  // 在小程序环境中，我们使用当前时间作为构建时间
  return new Date().toLocaleString('zh-CN')
}

// 获取 API 基础 URL
function getApiBaseUrl(envType: EnvType): string {
  switch (envType) {
    case 'development':
      return 'http://localhost:3000'
    case 'preview':
      // 开发版/体验版使用测试服务器
      return 'https://your-preview-api.com'
    case 'production':
      // 正式版使用生产服务器
      return 'https://your-production-api.com'
    default:
      return 'http://localhost:3000'
  }
}

// 打印环境信息（用于调试）
export function logEnvInfo(): void {
  const env = getEnvInfo()

  console.log('==========================================')
  console.log('📦 应用环境信息')
  console.log('==========================================')
  console.log(`环境类型: ${env.type}`)
  console.log(`应用版本: ${env.version}`)
  console.log(`构建时间: ${env.buildTime}`)
  console.log(`API 地址: ${env.apiBaseUrl}`)
  console.log(`调试模式: ${env.enableDebug}`)
  console.log(`本地开发: ${env.isLocalDev}`)
  console.log('==========================================')
}
