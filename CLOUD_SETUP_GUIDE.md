# 云开发配置详细步骤指南

本指南将一步步指导你完成腾讯云开发环境的配置。

**环境 ID**：`cloudbase-8g1wqiy0823dea4a`

---

## 📋 准备工作

在开始之前，请确保：
- [ ] 已安装微信开发者工具
- [ ] 已在腾讯云创建了环境（ID：`cloudbase-8g1wqiy0823dea4a`）
- [ ] 已拉取最新的代码（包含云函数代码）

---

## 🚀 配置步骤

### 步骤 1：关联云开发环境（2分钟）

#### 操作步骤

1. **打开微信开发者工具**
   - 启动微信开发者工具
   - 打开你的小程序项目

2. **进入云开发**
   - 点击顶部菜单的 **云开发** 按钮
   - 如果没有看到这个按钮，先编译小程序

3. **开通云开发**
   - 点击 **开通** 按钮
   - 选择环境：`cloudbase-8g1wqiy0823dea4a`
   - 点击 **确定**

4. **验证关联成功**
   - 看到 **云开发控制台** 界面
   - 顶部显示环境 ID：`cloudbase-8g1wqiy0823dea4a`

---

### 步骤 2：创建数据库集合（2分钟）

#### 方式一：在微信开发者工具中创建

1. **打开云开发控制台**
   - 点击顶部菜单 **云开发**
   - 进入云开发控制台

2. **进入数据库**
   - 点击左侧菜单 **数据库**

3. **新建集合**
   - 点击 **+** 按钮或 **新建集合**
   - 集合名称输入：`users`
   - 点击 **确定**

4. **设置权限**
   - 点击集合名称 `users`
   - 点击 **权限设置**
   - 选择 **所有用户可读写**
   - 点击 **保存**

---

#### 方式二：在腾讯云控制台创建（推荐）

1. **访问腾讯云控制台**
   - 打开浏览器，访问：https://console.cloud.tencent.com/tcb
   - 登录腾讯云账号

2. **选择环境**
   - 在环境列表中找到：`cloudbase-8g1wqiy0823dea4a`
   - 点击进入

3. **进入数据库**
   - 点击左侧菜单 **数据库**

4. **新建集合**
   - 点击 **新建集合**
   - 集合名称：`users`
   - 权限设置：**所有用户可读写**
   - 点击 **确定**

---

### 步骤 3：创建云存储目录（2分钟）

1. **进入存储**
   - 在云开发控制台
   - 点击左侧菜单 **存储**

2. **新建文件夹**
   - 点击 **新建文件夹**
   - 文件夹名称：`avatars`
   - 点击 **确定**

3. **设置权限（可选）**
   - 点击 **存储设置**
   - 权限设置为 **所有用户可读写**
   - 点击 **保存**

---

### 步骤 4：上传云函数（10分钟）

#### 4.1 上传 login 云函数

1. **创建云函数**
   - 在微信开发者工具中
   - 项目根目录右键
   - 选择 **新建 Node.js 云函数**
   - 输入名称：`login`
   - 点击 **确定**

2. **编辑云函数代码**
   - 找到新建的 `login` 文件夹
   - 打开 `index.js` 文件
   - 删除所有默认代码
   - 复制以下代码并粘贴：

```javascript
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
```

3. **保存文件**
   - 按 `Ctrl + S`（Windows）或 `Cmd + S`（Mac）
   - 确保文件已保存

4. **上传云函数**
   - 右键点击 `login` 文件夹
   - 选择 **上传并部署：云端安装依赖**
   - 等待上传和部署完成（约 30 秒）
   - 看到 "上传成功" 提示

---

#### 4.2 上传 updateUserInfo 云函数

1. **创建云函数**
   - 项目根目录右键
   - 选择 **新建 Node.js 云函数**
   - 输入名称：`updateUserInfo`
   - 点击 **确定**

2. **编辑云函数代码**
   - 打开 `updateUserInfo/index.js`
   - 复制以下代码：

```javascript
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  const { openid, nickname, avatar_url } = event

  try {
    const db = cloud.database()
    const updateData = {
      updated_at: new Date().toISOString()
    }

    if (nickname !== undefined) {
      updateData.nickname = nickname
    }
    if (avatar_url !== undefined) {
      updateData.avatar_url = avatar_url
    }

    const { stats } = await db.collection('users')
      .where({ openid })
      .update({
        data: updateData
      })

    if (stats.updated > 0) {
      return {
        code: 200,
        msg: 'success',
        data: { updated: stats.updated }
      }
    } else {
      return {
        code: 404,
        msg: '用户不存在',
        data: null
      }
    }
  } catch (error) {
    console.error('更新用户信息失败:', error)
    return {
      code: 500,
      msg: '更新失败：' + error.message,
      data: null
    }
  }
}
```

3. **保存并上传**
   - 保存文件
   - 右键 `updateUserInfo` 文件夹
   - 选择 **上传并部署：云端安装依赖**
   - 等待部署完成

---

#### 4.3 上传 updateHighestLevel 云函数

1. **创建云函数**
   - 项目根目录右键
   - 选择 **新建 Node.js 云函数**
   - 输入名称：`updateHighestLevel`
   - 点击 **确定**

2. **编辑云函数代码**
   - 打开 `updateHighestLevel/index.js`
   - 复制以下代码：

```javascript
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  const { openid, highest_level } = event

  try {
    const db = cloud.database()
    const updateData = {
      updated_at: new Date().toISOString()
    }

    if (highest_level !== undefined) {
      updateData.highest_level = highest_level
    }

    const { stats } = await db.collection('users')
      .where({ openid })
      .update({
        data: updateData
      })

    if (stats.updated > 0) {
      return {
        code: 200,
        msg: 'success',
        data: { updated: stats.updated }
      }
    } else {
      return {
        code: 404,
        msg: '用户不存在',
        data: null
      }
    }
  } catch (error) {
    console.error('更新最高关卡失败:', error)
    return {
      code: 500,
      msg: '更新失败：' + error.message,
      data: null
    }
  }
}
```

3. **保存并上传**
   - 保存文件
   - 右键 `updateHighestLevel` 文件夹
   - 选择 **上传并部署：云端安装依赖**

---

#### 4.4 上传 getRankList 云函数

1. **创建云函数**
   - 项目根目录右键
   - 选择 **新建 Node.js 云函数**
   - 输入名称：`getRankList`
   - 点击 **确定**

2. **编辑云函数代码**
   - 打开 `getRankList/index.js`
   - 复制以下代码：

```javascript
const cloud = require('wx-server-sdk')

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
```

3. **保存并上传**
   - 保存文件
   - 右键 `getRankList` 文件夹
   - 选择 **上传并部署：云端安装依赖**

---

#### 4.5 上传 addPoints 云函数

1. **创建云函数**
   - 项目根目录右键
   - 选择 **新建 Node.js 云函数**
   - 输入名称：`addPoints`
   - 点击 **确定**

2. **编辑云函数代码**
   - 打开 `addPoints/index.js`
   - 复制以下代码：

```javascript
const cloud = require('wx-server-sdk')

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
```

3. **保存并上传**
   - 保存文件
   - 右键 `addPoints` 文件夹
   - 选择 **上传并部署：云端安装依赖**

---

#### 4.6 上传 consumePoints 云函数

1. **创建云函数**
   - 项目根目录右键
   - 选择 **新建 Node.js 云函数**
   - 输入名称：`consumePoints`
   - 点击 **确定**

2. **编辑云函数代码**
   - 打开 `consumePoints/index.js`
   - 复制以下代码：

```javascript
const cloud = require('wx-server-sdk')

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

      // 检查积分是否足够
      if (currentPoints < points) {
        await transaction.rollback()
        return {
          code: 400,
          msg: '积分不足',
          data: {
            current_points: currentPoints,
            required_points: points
          }
        }
      }

      const newPoints = currentPoints - points

      // 扣除积分
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
          consumed: points
        }
      }
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  } catch (error) {
    console.error('消耗积分失败:', error)
    return {
      code: 500,
      msg: '消耗积分失败：' + error.message,
      data: null
    }
  }
}
```

3. **保存并上传**
   - 保存文件
   - 右键 `consumePoints` 文件夹
   - 选择 **上传并部署：云端安装依赖**

---

### 步骤 5：验证云函数（2分钟）

#### 5.1 在微信开发者工具中测试

1. **打开控制台**
   - 在微信开发者工具中
   - 点击底部菜单 **调试器**
   - 点击 **Console** 标签

2. **测试登录函数**

复制以下代码到控制台，按回车执行：

```javascript
wx.cloud.callFunction({
  name: 'login',
  data: {
    openid: 'test_001',
    nickname: '测试用户',
    avatar_url: ''
  }
}).then(res => {
  console.log('✅ 登录成功:', res.result)
}).catch(err => {
  console.error('❌ 登录失败:', err)
})
```

**预期输出**：
```
✅ 登录成功: { code: 200, msg: 'success', data: { ... } }
```

3. **测试排行榜函数**

```javascript
wx.cloud.callFunction({
  name: 'getRankList',
  data: {
    limit: 10
  }
}).then(res => {
  console.log('✅ 排行榜数据:', res.result)
}).catch(err => {
  console.error('❌ 获取排行榜失败:', err)
})
```

**预期输出**：
```
✅ 排行榜数据: { code: 200, msg: 'success', data: [...] }
```

---

### 步骤 6：编译小程序（2分钟）

1. **打开终端**
   - 在微信开发者工具中
   - 点击 **终端** 菜单
   - 点击 **新建终端**

2. **编译小程序**

在终端中执行：

```bash
pnpm build:weapp
```

3. **等待编译完成**
   - 看到编译成功的提示
   - 确认没有错误信息

---

### 步骤 7：预览小程序（2分钟）

1. **预览小程序**
   - 点击微信开发者工具顶部菜单的 **预览**
   - 生成预览二维码

2. **扫描二维码**
   - 使用微信扫描二维码
   - 在手机中打开小程序

3. **测试功能**
   - 点击登录按钮
   - 选择关卡开始游戏
   - 完成拼图
   - 查看排行榜

---

### 步骤 8：上传小程序（2分钟）

1. **上传小程序**
   - 点击微信开发者工具右上角的 **上传** 按钮
   - 填写版本号：`1.0.0`
   - 填写项目备注：`腾讯云开发版本`
   - 点击 **上传**

2. **等待上传完成**
   - 看到 "上传成功" 提示

---

## 🧪 完整测试清单

### 云函数测试

- [ ] `login` 云函数测试通过
- [ ] `updateUserInfo` 云函数测试通过
- [ ] `updateHighestLevel` 云函数测试通过
- [ ] `getRankList` 云函数测试通过
- [ ] `addPoints` 云函数测试通过
- [ ] `consumePoints` 云函数测试通过

### 数据库测试

- [ ] 数据库集合 `users` 已创建
- [ ] 可以写入用户数据
- [ ] 可以查询用户数据
- [ ] 可以更新用户数据

### 存储测试

- [ ] 存储目录 `avatars` 已创建
- [ ] 可以上传头像图片
- [ ] 可以下载头像图片

### 小程序功能测试

- [ ] 用户登录功能正常
- [ ] 用户信息更新正常
- [ ] 关卡进度保存正常
- [ ] 排行榜显示正常
- [ ] 积分系统正常
- [ ] 头像上传正常

---

## ⚠️ 常见问题及解决方案

### 问题 1：云开发未初始化

**错误信息**：
```
云开发未初始化，请先调用 init
```

**解决方案**：
1. 检查 `src/app.ts` 中的初始化代码
2. 确认环境 ID 正确：`cloudbase-8g1wqiy0823dea4a`
3. 重新编译小程序

---

### 问题 2：云函数调用失败

**错误信息**：
```
云函数不存在或权限不足
```

**解决方案**：
1. 检查云函数是否已上传
2. 右键云函数文件夹
3. 选择 **上传并部署：云端安装依赖**

---

### 问题 3：数据库权限错误

**错误信息**：
```
权限不足，拒绝访问
```

**解决方案**：
1. 进入云开发控制台
2. 点击 **数据库**
3. 选择 `users` 集合
4. 点击 **权限设置**
5. 选择 **所有用户可读写**
6. 点击 **保存**

---

### 问题 4：云存储上传失败

**错误信息**：
```
文件上传失败
```

**解决方案**：
1. 检查存储空间是否已开通
2. 检查存储权限设置
3. 确认文件大小不超过限制

---

### 问题 5：编译错误

**错误信息**：
```
Module not found: Can't resolve '@/xxx'
```

**解决方案**：
1. 删除 `node_modules` 文件夹
2. 删除 `pnpm-lock.yaml` 文件
3. 重新执行 `pnpm install`
4. 重新编译

---

## 📊 配置完成检查清单

配置完成后，请确认以下事项：

### 环境配置
- [ ] 云开发环境已关联（`cloudbase-8g1wqiy0823dea4a`）
- [ ] 环境配置文件已更新（`cloudbaserc.json`）
- [ ] 前端初始化代码已更新（`src/app.ts`）

### 云函数
- [ ] `login` 云函数已上传
- [ ] `updateUserInfo` 云函数已上传
- [ ] `updateHighestLevel` 云函数已上传
- [ ] `getRankList` 云函数已上传
- [ ] `addPoints` 云函数已上传
- [ ] `consumePoints` 云函数已上传

### 数据库
- [ ] `users` 集合已创建
- [ ] 集合权限已设置（所有用户可读写）
- [ ] 可以正常读写数据

### 存储
- [ ] `avatars` 目录已创建
- [ ] 存储权限已设置（所有用户可读写）
- [ ] 可以上传和下载文件

### 小程序
- [ ] 小程序已编译
- [ ] 云开发已初始化
- [ ] 登录功能测试通过
- [ ] 游戏功能测试通过
- [ ] 排行榜功能测试通过

---

## 🎯 下一步

配置完成后：

1. **测试小程序**
   - 在微信开发者工具中预览
   - 使用手机扫码测试

2. **上传小程序**
   - 上传到微信平台
   - 提交审核

3. **监控运行**
   - 查看云函数调用日志
   - 查看数据库操作日志
   - 监控存储使用情况

---

## 📚 相关文档

- **腾讯云开发控制台**：https://console.cloud.tencent.com/tcb
- **腾讯云开发文档**：https://docs.cloudbase.net/
- **微信小程序云开发文档**：https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html

---

## 🆘 获取帮助

如果遇到问题：

1. 查看 **常见问题及解决方案** 章节
2. 查看云函数日志
3. 查看数据库日志
4. 联系腾讯云技术支持

---

## 🎉 完成配置

恭喜！当你完成以上所有步骤后，你的拼图小游戏就已经成功部署到腾讯云开发环境了！

**预计总时间**：20-25 分钟

**开始配置吧！** 🚀
