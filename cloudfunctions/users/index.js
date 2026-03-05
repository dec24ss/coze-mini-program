'use strict';

const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

// 获取或创建用户
exports.main = async (event, context) => {
  const { openid, nickname, avatar_url } = event;

  try {
    // 查询用户是否存在
    const { data: existingUsers } = await db
      .collection('users')
      .where({
        openid: db.command.eq(openid)
      })
      .get();

    if (existingUsers && existingUsers.length > 0) {
      const existingUser = existingUsers[0];
      let needUpdate = false;
      const updateData = {};

      // 检查是否需要更新昵称
      if (nickname && nickname !== existingUser.nickname) {
        updateData.nickname = nickname;
        needUpdate = true;
      }

      // 检查是否需要更新头像
      if (avatar_url && avatar_url !== existingUser.avatar_url) {
        updateData.avatar_url = avatar_url;
        needUpdate = true;
      }

      // 如果需要更新
      if (needUpdate) {
        updateData.updatedAt = new Date();
        await db
          .collection('users')
          .doc(existingUser._id)
          .update({
            data: updateData
          });

        // 重新查询获取更新后的数据
        const { data: updatedUsers } = await db
          .collection('users')
          .where({
            openid: db.command.eq(openid)
          })
          .get();

        if (updatedUsers && updatedUsers.length > 0) {
          return {
            code: 200,
            msg: 'success',
            data: updatedUsers[0]
          };
        }
      }

      // 不需要更新，返回现有用户
      return {
        code: 200,
        msg: 'success',
        data: existingUser
      };
    }

    // 用户不存在，创建新用户
    const newUser = {
      openid,
      nickname: nickname || '匿名用户',
      avatar_url: avatar_url || '',
      highestLevel: 0,
      points: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const { _id } = await db
      .collection('users')
      .add({
        data: newUser
      });

    // 查询新创建的用户
    const { data: createdUsers } = await db
      .collection('users')
      .doc(_id)
      .get();

    return {
      code: 200,
      msg: 'success',
      data: createdUsers.data
    };
  } catch (error) {
    console.error('用户操作失败:', error);
    return {
      code: 500,
      msg: '操作失败',
      data: null
    };
  }
};
