// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const { action, openid, avatar_url, nickname } = event

  try {
    if (action === 'getOrCreate') {
      // 查询用户是否存在
      const userRes = await db.collection('users').where({
        openid
      }).get()

      if (userRes.data.length > 0) {
        const existingUser = userRes.data[0]
        // 如果有新的头像或昵称，更新
        if (avatar_url || nickname) {
          const updateData = {}
          if (avatar_url) updateData.avatar_url = avatar_url
          if (nickname) updateData.nickname = nickname
          
          await db.collection('users').doc(existingUser._id).update({
            data: updateData
          })
          
          // 返回更新后的用户
          const updatedRes = await db.collection('users').doc(existingUser._id).get()
          return {
            success: true,
            data: updatedRes.data
          }
        }
        return {
          success: true,
          data: existingUser
        }
      } else {
        // 创建新用户
        const newUser = {
          openid,
          avatar_url: avatar_url || '',
          nickname: nickname || '微信用户',
          level_unlocked: 1,
          best_scores: {},
          created_at: new Date(),
          updated_at: new Date()
        }
        
        const addRes = await db.collection('users').add({
          data: newUser
        })
        
        return {
          success: true,
          data: {
            _id: addRes._id,
            ...newUser
          }
        }
      }
    } else if (action === 'update') {
      // 更新用户信息
      const updateData = {}
      if (avatar_url) updateData.avatar_url = avatar_url
      if (nickname) updateData.nickname = nickname
      updateData.updated_at = new Date()
      
      await db.collection('users').where({
        openid
      }).update({
        data: updateData
      })
      
      const updatedRes = await db.collection('users').where({
        openid
      }).get()
      
      return {
        success: true,
        data: updatedRes.data[0]
      }
    }
    
    return {
      success: false,
      error: 'Unknown action'
    }
  } catch (error) {
    console.error('Error in users function:', error)
    return {
      success: false,
      error: error.message
    }
  }
}
