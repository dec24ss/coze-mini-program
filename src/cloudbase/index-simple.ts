// 简化版本：小程序端暂时不使用云开发，避免 BigInt 兼容性问题
// 等下载到本地后再启用完整的云开发功能

// 云开发环境 ID
const CLOUDBASE_ENV = 'cloudbase-8g1wqiy0823dea4a'

// 标记是否使用云开发（可以在本地开发时改为 true）
const USE_CLOUDBASE = false

// 初始化云开发实例
let app: any = null

export async function initCloudbase() {
  if (!USE_CLOUDBASE) {
    console.log('⚠️  云开发暂时禁用（避免 BigInt 兼容性问题）')
    return null
  }

  if (app) {
    return app
  }

  try {
    console.log('初始化云开发环境:', CLOUDBASE_ENV)
    
    // 动态导入云开发 SDK
    const cloud = await import('@cloudbase/js-sdk')
    
    app = cloud.init({
      env: CLOUDBASE_ENV
    })
    
    console.log('云开发初始化成功')
    return app
  } catch (error) {
    console.error('云开发初始化失败:', error)
    throw error
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
  const cloudbase = await getCloudbaseApp()
  return cloudbase?.database()
}

export async function getCloudbaseStorage() {
  if (!USE_CLOUDBASE) {
    return null
  }
  const cloudbase = await getCloudbaseApp()
  return (cloudbase as any)?.storage()
}

// 导出是否使用云开发的标记
export const isCloudbaseEnabled = USE_CLOUDBASE
