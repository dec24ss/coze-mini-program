'use strict';

const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 更新用户信息
exports.main = async (event, context) => {
  const { openid, nickname, avatar_url, highest_level, points } = event;

  try {
    // 查询用户
    const { data: existingUsers } = await db
      .collection('users')
      .where({
        openid: db.command.eq(openid)
      })
      .get();

    if (!existingUsers || existingUsers.length === 0) {
      return {
        code: 404,
        msg: '用户不存在',
        data: null
      };
    }

    const user = existingUsers[0];
    const updateData = {};

    // 更新昵称
    if (nickname !== undefined) {
      updateData.nickname = nickname;
    }

    // 更新头像
    if (avatar_url !== undefined) {
      updateData.avatar_url = avatar_url;
    }

    // 更新最高关卡
    if (highest_level !== undefined) {
      updateData.highestLevel = highest_level;
    }

    // 更新积分
    if (points !== undefined) {
      updateData.points = points;
    }

    // 只有在有更新时才执行
    if (Object.keys(updateData).length > 0) {
      updateData.updatedAt = new Date();
      
      await db
        .collection('users')
        .doc(user._id)
        .update({
          data: updateData
        });

      // 重新查询获取更新后的数据
      const { data: updatedUsers } = await db
        .collection('users')
        .doc(user._id)
        .get();

      return {
        code: 200,
        msg: 'success',
        data: updatedUsers.data
      };
    }

    // 没有更新，返回原数据
    return {
      code: 200,
      msg: 'success',
      data: user
    };
  } catch (error) {
    console.error('更新用户失败:', error);
    return {
      code: 500,
      msg: '更新用户失败',
      data: null
    };
  }
};
