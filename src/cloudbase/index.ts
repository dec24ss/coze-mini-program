// 云开发环境 ID
const CLOUDBASE_ENV = 'cloudbase-8g1wqiy0823dea4a'

// ⚠️ 关键配置：在 Coze 环境中设为 false，下载到本地后改为 true
export const USE_CLOUDBASE = false  // ⚠️ 部署前请改为 true

// 初始化云开发实例
let app: any = null
let isInitializing = false
let initError: Error | null = null

export async function initCloudbase() {
  if (!USE_CLOUDBASE) {
    return null
  }

  if (app) {
    return app
  }

  if (isInitializing) {
    // 等待初始化完成
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (app || initError) {
          clearInterval(checkInterval)
          resolve(app || null)
        }
      }, 100)
    })
  }

  isInitializing = true

  try {
    // 动态导入，避免 Coze 环境构建时的 BigInt 问题
    const cloud = await import('@cloudbase/js-sdk')
    
    // @ts-ignore - 云开发 SDK 类型声明问题
    app = cloud.init({
      env: CLOUDBASE_ENV
    })
    
    console.log('✅ 云开发初始化成功')
    return app
  } catch (error) {
    console.error('❌ 云开发初始化失败:', error)
    initError = error as Error
    // 不抛出错误，而是返回 null，让上层使用本地存储
    return null
  } finally {
    isInitializing = false
  }
}

export async function getCloudbaseApp() {
  if (!USE_CLOUDBASE) {
    return null
  }
  if (!app) {
    return await initCloudbase()
  }
  return app
}

export async function getCloudbaseDB() {
  if (!USE_CLOUDBASE) {
    return null
  }
  try {
    const cloudbase = await getCloudbaseApp()
    return cloudbase?.database() || null
  } catch (error) {
    console.error('❌ 获取云开发数据库失败:', error)
    return null
  }
}

export async function getCloudbaseStorage() {
  if (!USE_CLOUDBASE) {
    return null
  }
  try {
    const cloudbase = await getCloudbaseApp()
    return (cloudbase as any)?.storage() || null
  } catch (error) {
    console.error('❌ 获取云开发存储失败:', error)
    return null
  }
}

// 导出是否使用云开发的标记
export const isCloudbaseEnabled = USE_CLOUDBASE
