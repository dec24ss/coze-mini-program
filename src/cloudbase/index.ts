// 云开发环境 ID
const CLOUDBASE_ENV = 'cloudbase-8g1wqiy0823dea4a'

// ⚠️ 关键配置：在 Coze 环境中设为 false，下载到本地后改为 true
export const USE_CLOUDBASE = false

// 初始化云开发实例
let app: any = null

export async function initCloudbase() {
  if (!USE_CLOUDBASE) {
    console.log('⚠️  云开发暂时禁用（Coze 环境）')
    console.log('💡 下载到本地后，将 src/cloudbase/index.ts 中的 USE_CLOUDBASE 改为 true')
    return null
  }

  if (app) {
    return app
  }

  try {
    console.log('初始化云开发环境:', CLOUDBASE_ENV)
    
    // 动态导入，避免 Coze 环境构建时的 BigInt 问题
    const cloud = await import('@cloudbase/js-sdk')
    
    // @ts-ignore - 云开发 SDK 类型声明问题
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
