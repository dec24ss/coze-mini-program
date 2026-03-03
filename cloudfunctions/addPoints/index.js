// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  const { openid, points } = event

  try {
    const db = cloud.database()

    // 使用数据库事务更新积分
    const transaction = await db.startTransaction()

    try {
      // 获取当前用户
      const { data: users } = await transaction.collection('users')
        .where({ openid })
        .get()

      if (users.length === 0) {
        await transaction.rollback()
        return {
          code: 404,
          msg: '用户不存在',
          data: null
        }
      }

      const currentPoints = users[0].points || 0
      const newPoints = currentPoints + points

      // 更新积分
      await transaction.collection('users')
        .where({ openid })
        .update({
          data: {
            points: newPoints,
            updated_at: new Date().toISOString()
          }
        })

      await transaction.commit()

      return {
        code: 200,
        msg: 'success',
        data: {
          old_points: currentPoints,
          new_points: newPoints,
          added: points
        }
      }
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  } catch (error) {
    console.error('添加积分失败:', error)
    return {
      code: 500,
      msg: '添加积分失败：' + error.message,
      data: null
    }
  }
}
