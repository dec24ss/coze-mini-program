// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const { openid, avatar_url, nickname, level_unlocked, best_scores } = event

  try {
    const updateData = {
      updated_at: new Date()
    }
    
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url
    if (nickname !== undefined) updateData.nickname = nickname
    if (level_unlocked !== undefined) updateData.level_unlocked = level_unlocked
    if (best_scores !== undefined) updateData.best_scores = best_scores
    
    // 更新用户
    await db.collection('users').where({
      openid
    }).update({
      data: updateData
    })
    
    // 获取更新后的用户
    const userRes = await db.collection('users').where({
      openid
    }).get()
    
    return {
      success: true,
      data: userRes.data[0]
    }
  } catch (error) {
    console.error('Error in updateUser function:', error)
    return {
      success: false,
      error: error.message
    }
  }
}
