// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  const { openid, highest_level } = event

  try {
    const db = cloud.database()
    const updateData = {
      updated_at: new Date().toISOString()
    }

    if (highest_level !== undefined) {
      updateData.highest_level = highest_level
    }

    const { stats } = await db.collection('users')
      .where({ openid })
      .update({
        data: updateData
      })

    if (stats.updated > 0) {
      return {
        code: 200,
        msg: 'success',
        data: { updated: stats.updated }
      }
    } else {
      return {
        code: 404,
        msg: '用户不存在',
        data: null
      }
    }
  } catch (error) {
    console.error('更新最高关卡失败:', error)
    return {
      code: 500,
      msg: '更新失败：' + error.message,
      data: null
    }
  }
}
