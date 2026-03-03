// 云函数入口文件
const cloud = require('wx-server-sdk')
const db = cloud.database()

// 初始化 cloud
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  const { openid, nickname, avatar_url } = event

  try {
    // 查询用户是否已存在
    const { data: existingUsers } = await db.collection('users')
      .where({ openid })
      .get()

    if (existingUsers.length > 0) {
      // 用户已存在，返回用户信息
      return {
        code: 200,
        msg: 'success',
        data: existingUsers[0]
      }
    }

    // 创建新用户
    const newUser = {
      openid,
      nickname: nickname || '拼图玩家',
      avatar_url: avatar_url || '',
      highest_level: 0,
      points: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data: createdUser } = await db.collection('users').add({
      data: newUser
    })

    return {
      code: 200,
      msg: 'success',
      data: {
        _id: createdUser._id,
        ...newUser
      }
    }
  } catch (error) {
    console.error('登录失败:', error)
    return {
      code: 500,
      msg: '登录失败：' + error.message,
      data: null
    }
  }
}
