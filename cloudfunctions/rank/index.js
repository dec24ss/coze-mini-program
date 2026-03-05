// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const { action, openid, level, score, avatar_url, nickname } = event

  try {
    if (action === 'getTop100') {
      // 获取前100名
      const rankRes = await db.collection('rank')
        .orderBy('score', 'asc')
        .limit(100)
        .get()
      
      return {
        success: true,
        data: rankRes.data
      }
    } else if (action === 'submitScore') {
      // 提交分数
      const existingRes = await db.collection('rank').where({
        openid,
        level
      }).get()
      
      if (existingRes.data.length > 0) {
        const existing = existingRes.data[0]
        if (score < existing.score) {
          // 新纪录，更新
          await db.collection('rank').doc(existing._id).update({
            data: {
              score,
              avatar_url: avatar_url || existing.avatar_url,
              nickname: nickname || existing.nickname,
              updated_at: new Date()
            }
          })
        }
      } else {
        // 新纪录
        await db.collection('rank').add({
          data: {
            openid,
            level,
            score,
            avatar_url: avatar_url || '',
            nickname: nickname || '微信用户',
            created_at: new Date(),
            updated_at: new Date()
          }
        })
      }
      
      return {
        success: true
      }
    }
    
    return {
      success: false,
      error: 'Unknown action'
    }
  } catch (error) {
    console.error('Error in rank function:', error)
    return {
      success: false,
      error: error.message
    }
  }
}
