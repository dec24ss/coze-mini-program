// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  const { limit = 100 } = event

  try {
    const db = cloud.database()

    // 获取排行榜（按最高关卡降序排序，如果相同则按积分降序）
    const { data: rankList } = await db.collection('users')
      .orderBy('highest_level', 'desc')
      .orderBy('points', 'desc')
      .limit(limit)
      .get()

    // 添加排名
    const rankedList = rankList.map((item, index) => ({
      ...item,
      rank: index + 1
    }))

    return {
      code: 200,
      msg: 'success',
      data: rankedList
    }
  } catch (error) {
    console.error('获取排行榜失败:', error)
    return {
      code: 500,
      msg: '获取排行榜失败：' + error.message,
      data: []
    }
  }
}
