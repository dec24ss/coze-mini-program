/**
 * 缓存管理工具
 * 用于管理小程序的缓存，确保数据一致性
 */

import Taro from '@tarojs/taro'

// 缓存键名
export const CACHE_KEYS = {
  // 图片缓存
  IMAGE_LIST: 'imageList',
  LEVEL_IMAGE_MAP: 'levelImageMap',
  IMAGE_VERSION: 'imageVersion',

  // 用户数据
  OPENID: 'openid',
  USER_INFO: 'userInfo',
  HIGHEST_LEVEL: 'highestLevel',
  UNLOCKED_LEVELS: 'unlockedLevels',
  POINTS: 'points',
  LEVEL_IMAGES: 'levelImages',

  // 设置
  SOUND_ENABLED: 'soundEnabled',
  VIBRATION_ENABLED: 'vibrationEnabled',

  // 元数据
  APP_VERSION: 'appVersion',
  CACHE_VERSION: 'cacheVersion'
}

// 缓存版本号（用于控制缓存失效）
export const CACHE_VERSION = '1.0.0'

/**
 * 设置缓存（带版本控制）
 */
export function setCacheWithVersion<T>(key: string, value: T, version: string = CACHE_VERSION): void {
  const data = {
    value,
    version,
    timestamp: Date.now()
  }
  Taro.setStorageSync(key, JSON.stringify(data))
}

/**
 * 获取缓存（带版本检查）
 */
export function getCacheWithVersion<T>(key: string, expectedVersion?: string): T | null {
  try {
    const raw = Taro.getStorageSync(key)
    if (!raw) {
      return null
    }

    const data = JSON.parse(raw)

    // 检查缓存版本
    if (expectedVersion && data.version !== expectedVersion) {
      console.log(`🗑️  缓存版本不匹配 (${data.version} !== ${expectedVersion})，清除缓存: ${key}`)
      removeCache(key)
      return null
    }

    return data.value as T
  } catch (error) {
    console.error('读取缓存失败:', error)
    return null
  }
}

/**
 * 删除缓存
 */
export function removeCache(key: string): void {
  Taro.removeStorageSync(key)
}

/**
 * 清除所有缓存
 */
export function clearAllCache(): void {
  Object.values(CACHE_KEYS).forEach(key => {
    removeCache(key)
  })
  console.log('✅ 所有缓存已清除')
}

/**
 * 清除应用缓存（保留用户数据）
 */
export function clearAppCache(keepUserData: boolean = true): void {
  const keysToRemove = keepUserData
    ? [
        CACHE_KEYS.IMAGE_LIST,
        CACHE_KEYS.LEVEL_IMAGE_MAP,
        CACHE_KEYS.IMAGE_VERSION,
        CACHE_KEYS.SOUND_ENABLED,
        CACHE_KEYS.VIBRATION_ENABLED
      ]
    : Object.values(CACHE_KEYS)

  keysToRemove.forEach(key => {
    removeCache(key)
  })

  console.log(`✅ 应用缓存已清除${keepUserData ? '（保留用户数据）' : ''}`)
}

/**
 * 检查缓存是否过期
 */
export function isCacheExpired(key: string, maxAge: number = 24 * 60 * 60 * 1000): boolean {
  try {
    const raw = Taro.getStorageSync(key)
    if (!raw) {
      return true
    }

    const data = JSON.parse(raw)
    const age = Date.now() - (data.timestamp || 0)
    return age > maxAge
  } catch (error) {
    console.error('检查缓存过期失败:', error)
    return true
  }
}

/**
 * 获取缓存大小（字节）
 */
export function getCacheSize(): number {
  try {
    const info = Taro.getStorageInfoSync()
    return info.currentSize * 1024  // KB -> Bytes
  } catch (error) {
    console.error('获取缓存大小失败:', error)
    return 0
  }
}

/**
 * 格式化缓存大小
 */
export function formatCacheSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`
}

/**
 * 打印缓存信息（用于调试）
 */
export function logCacheInfo(): void {
  try {
    const info = Taro.getStorageInfoSync()
    const cacheSize = getCacheSize()

    console.log('==========================================')
    console.log('💾 缓存信息')
    console.log('==========================================')
    console.log(`当前大小: ${formatCacheSize(cacheSize)}`)
    console.log(`限制大小: ${formatCacheSize(info.limitSize * 1024)}`)
    console.log(`使用率: ${((cacheSize / (info.limitSize * 1024)) * 100).toFixed(2)}%`)
    console.log(`键数量: ${info.keys.length}`)
    console.log('键列表:', info.keys)
    console.log('==========================================')
  } catch (error) {
    console.error('获取缓存信息失败:', error)
  }
}
