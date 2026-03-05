import cloud from '@cloudbase/js-sdk'

// 云开发环境 ID
const CLOUDBASE_ENV = 'cloudbase-8g1wqiy0823dea4a'

// 初始化云开发实例
let app: ReturnType<typeof cloud.init> | null = null

export function initCloudbase() {
  if (app) {
    return app
  }

  try {
    console.log('初始化云开发环境:', CLOUDBASE_ENV)
    
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

export function getCloudbaseApp() {
  if (!app) {
    return initCloudbase()
  }
  return app
}

export function getCloudbaseDB() {
  const cloudbase = getCloudbaseApp()
  return cloudbase.database()
}

export function getCloudbaseStorage() {
  const cloudbase = getCloudbaseApp()
  return cloudbase.storage()
}
