'use strict';

const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 获取排行榜
exports.main = async (event, context) => {
  const { limit = 100 } = event;

  try {
    const { data: rankList } = await db
      .collection('users')
      .orderBy('highestLevel', 'desc')
      .orderBy('points', 'desc')
      .limit(limit)
      .get();

    // 添加排名
    const rankedList = rankList.map((item, index) => ({
      ...item,
      rank: index + 1
    }));

    return {
      code: 200,
      msg: 'success',
      data: rankedList
    };
  } catch (error) {
    console.error('获取排行榜失败:', error);
    return {
      code: 500,
      msg: '获取排行榜失败',
      data: null
    };
  }
};
