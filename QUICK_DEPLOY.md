# ⚡ 5分钟快速部署云函数

## 📱 第一步：打开云开发控制台

👉 点击这里：https://console.cloud.tencent.com/tcb

---

## 🔧 第二步：创建 users 云函数

### 2.1 新建函数
1. 点击左侧 **"云函数"**
2. 点击 **"新建"**
3. 填写：
   - 函数名称：`users`
   - 运行环境：Node.js 16
   - 创建方式：**空白函数**
4. 点击 **"确定"**

### 2.2 复制代码（直接复制下面的内容）

```javascript
'use strict';

const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
  const { openid, nickname, avatar_url } = event;

  try {
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

      if (nickname && nickname !== existingUser.nickname) {
        updateData.nickname = nickname;
        needUpdate = true;
      }

      if (avatar_url && avatar_url !== existingUser.avatar_url) {
        updateData.avatar_url = avatar_url;
        needUpdate = true;
      }

      if (needUpdate) {
        updateData.updatedAt = new Date();
        await db
          .collection('users')
          .doc(existingUser._id)
          .update({
            data: updateData
          });

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

      return {
        code: 200,
        msg: 'success',
        data: existingUser
      };
    }

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
```

### 2.3 粘贴代码
1. 点击刚创建的 `users` 函数
2. 点击 **"函数代码"** 标签
3. 删除编辑器中的所有内容
4. 粘贴上面的代码
5. 点击 **"保存"**
6. 点击 **"保存并安装依赖"**

---

## 🏆 第三步：创建 rank 云函数

### 3.1 新建函数
1. 点击 **"新建"**
2. 函数名称：`rank`
3. 运行环境：Node.js 16
4. 创建方式：**空白函数**
5. 点击 **"确定"**

### 3.2 复制代码

```javascript
'use strict';

const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
  const { limit = 100 } = event;

  try {
    const { data: rankList } = await db
      .collection('users')
      .orderBy('highestLevel', 'desc')
      .orderBy('points', 'desc')
      .limit(limit)
      .get();

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
```

### 3.3 粘贴代码
- 同上，删除默认代码，粘贴上面的代码，保存并安装依赖

---

## 👤 第四步：创建 updateUser 云函数

### 4.1 新建函数
1. 点击 **"新建"**
2. 函数名称：`updateUser`
3. 运行环境：Node.js 16
4. 创建方式：**空白函数**
5. 点击 **"确定"**

### 4.2 复制代码

```javascript
'use strict';

const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
  const { openid, nickname, avatar_url, highest_level, points } = event;

  try {
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

    if (nickname !== undefined) {
      updateData.nickname = nickname;
    }

    if (avatar_url !== undefined) {
      updateData.avatar_url = avatar_url;
    }

    if (highest_level !== undefined) {
      updateData.highestLevel = highest_level;
    }

    if (points !== undefined) {
      updateData.points = points;
    }

    if (Object.keys(updateData).length > 0) {
      updateData.updatedAt = new Date();
      
      await db
        .collection('users')
        .doc(user._id)
        .update({
          data: updateData
        });

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
```

### 4.3 粘贴代码
- 同上，删除默认代码，粘贴上面的代码，保存并安装依赖

---

## 📊 第五步：创建数据库

### 5.1 创建集合
1. 点击左侧 **"数据库"**
2. 点击 **"新建集合"**
3. 集合名称：`users`
4. 点击 **"确定"**

### 5.2 设置权限
1. 点击 `users` 集合
2. 点击 **"权限设置"** 标签
3. 选择 **"所有用户可读，仅创建者可写"**
4. 点击 **"确定"**

---

## ✅ 完成！

现在你已经成功部署了所有云函数和数据库！可以在小程序中测试了。
