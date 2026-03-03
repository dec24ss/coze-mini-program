// 后端 API 配置
// 在 Render 部署成功后，将 RENDER_API_URL 替换为实际的域名

const isWeapp = Taro.getEnv() === Taro.ENV_TYPE.WEAPP

// 🔴 部署后请修改这里：将域名替换为你的 Render 域名
// 例如：https://coze-mini-program-api-abc123.onrender.com
const RENDER_API_URL = 'https://coze-mini-program-api-xxx.onrender.com'

// 本地开发环境（开发时使用）
const LOCAL_API_URL = 'http://localhost:3000'

// 根据环境自动选择
export const API_BASE_URL = isWeapp ? RENDER_API_URL : ''

// 导出所有 API 端点
export const API_ENDPOINTS = {
  // 用户相关
  LOGIN: `${API_BASE_URL}/api/users/login`,
  UPDATE_USER_INFO: `${API_BASE_URL}/api/users/update`,
  UPDATE_HIGHEST_LEVEL: `${API_BASE_URL}/api/users/highest-level`,
  ADD_POINTS: `${API_BASE_URL}/api/users/points/add`,
  CONSUME_POINTS: `${API_BASE_URL}/api/users/points/consume`,
  GET_POINTS: `${API_BASE_URL}/api/users/points`,
  GET_RANK_LIST: `${API_BASE_URL}/api/users/ranklist`,

  // 文件上传
  UPLOAD_AVATAR: `${API_BASE_URL}/api/users/upload-avatar`,

  // 健康检查
  HEALTH: `${API_BASE_URL}/api/health`,
}
