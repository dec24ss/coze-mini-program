// 腾讯云开发 API 配置
// 在腾讯云开发环境中，使用云函数调用方式

const isWeapp = Taro.getEnv() === Taro.ENV_TYPE.WEAPP

// 🔴 部署到腾讯云后，需要在小程序中初始化云开发
// 在 app.tsx 中添加：
// Taro.cloud.init({
//   env: 'your-env-id'
// })

// 导出云函数调用方式
export const callCloudFunction = (name: string, data: any) => {
  return Taro.cloud.callFunction({
    name,
    data
  })
}

// 导出所有云函数名称
export const CLOUD_FUNCTIONS = {
  LOGIN: 'login',
  UPDATE_USER_INFO: 'updateUserInfo',
  UPDATE_HIGHEST_LEVEL: 'updateHighestLevel',
  GET_RANK_LIST: 'getRankList',
  ADD_POINTS: 'addPoints',
  CONSUME_POINTS: 'consumePoints'
}
