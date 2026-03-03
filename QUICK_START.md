# 快速部署指南（腾讯云开发环境）

环境 ID：`db-2gaczaywd186652b`

---

## 📋 前置条件

- ✅ 腾讯云开发环境已创建
- ✅ 环境 ID 已配置
- ✅ 微信开发者工具已安装

---

## 🚀 快速部署（5步完成）

### 步骤 1：关联云开发环境（2分钟）

1. 打开微信开发者工具
2. 打开你的小程序项目
3. 点击顶部菜单 **云开发**
4. 点击 **开通**
5. 选择环境：`db-2gaczaywd186652b`
6. 点击 **确定**

---

### 步骤 2：创建数据库集合（1分钟）

1. 打开腾讯云控制台：https://console.cloud.tencent.com/tcb
2. 选择环境：`db-2gaczaywd186652b`
3. 进入 **数据库** 标签
4. 点击 **新建集合**
5. 集合名称：`users`
6. 权限设置：**所有用户可读写**
7. 点击 **确定**

---

### 步骤 3：创建存储目录（1分钟）

1. 在腾讯云控制台
2. 进入 **存储** 标签
3. 点击 **新建文件夹**
4. 文件夹名称：`avatars`
5. 点击 **确定**

---

### 步骤 4：上传云函数（5分钟）

#### 4.1 上传 login 云函数

1. 在微信开发者工具中
2. 项目根目录右键
3. 选择 **新建 Node.js 云函数**
4. 函数名称：`login`
5. 打开 `cloudfunctions/login/index.js`
6. 复制以下代码并粘贴：

```javascript
const cloud = require('wx-server-sdk')
const db = cloud.database()

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  const { openid, nickname, avatar_url } = event

  try {
    const { data: existingUsers } = await db.collection('users')
      .where({ openid })
      .get()

    if (existingUsers.length > 0) {
      return {
        code: 200,
        msg: 'success',
        data: existingUsers[0]
      }
    }

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

7. 右键点击云函数文件夹
8. 选择 **上传并部署：云端安装依赖**
9. 等待部署完成

#### 4.2 重复上传其他云函数

按照相同步骤上传以下云函数：

| 云函数名称 | 代码文件 |
|-----------|---------|
| `updateUserInfo` | `cloudfunctions/updateUserInfo/index.js` |
| `updateHighestLevel` | `cloudfunctions/updateHighestLevel/index.js` |
| `getRankList` | `cloudfunctions/getRankList/index.js` |
| `addPoints` | `cloudfunctions/addPoints/index.js` |
| `consumePoints` | `cloudfunctions/consumePoints/index.js` |

---

### 步骤 5：编译和上传小程序（3分钟）

#### 5.1 编译小程序

在项目根目录执行：

```bash
pnpm build:weapp
```

#### 5.2 上传小程序

1. 打开微信开发者工具
2. 点击右上角 **上传** 按钮
3. 填写版本号：`1.0.0`
4. 填写项目备注：`腾讯云开发版本`
5. 点击 **上传**

#### 5.3 提交审核（可选）

1. 登录微信公众平台
2. 进入 **版本管理**
3. 找到刚上传的版本
4. 点击 **提交审核**
5. 填写审核信息
6. 等待审核通过

---

## 🧪 测试功能

### 测试 1：用户登录

在微信开发者工具控制台中执行：

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

预期输出：
```
✅ 登录成功: { code: 200, msg: 'success', data: { ... } }
```

---

### 测试 2：获取排行榜

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

预期输出：
```
✅ 排行榜数据: { code: 200, msg: 'success', data: [...] }
```

---

### 测试 3：测试游戏功能

1. 在微信开发者工具中预览小程序
2. 扫码进入小程序
3. 点击登录
4. 选择关卡开始游戏
5. 完成拼图
6. 查看排行榜

---

## ⚠️ 常见问题

### 问题 1：云开发未关联

**错误**：`云开发未初始化`

**解决方案**：
1. 在微信开发者工具中点击 **云开发**
2. 点击 **开通**
3. 选择环境：`db-2gaczaywd186652b`

---

### 问题 2：云函数调用失败

**错误**：`云函数不存在`

**解决方案**：
1. 检查云函数是否已上传
2. 右键云函数文件夹
3. 选择 **上传并部署：云端安装依赖**

---

### 问题 3：数据库操作失败

**错误**：`集合不存在`

**解决方案**：
1. 在腾讯云控制台创建 `users` 集合
2. 权限设置为 **所有用户可读写**

---

### 问题 4：云存储上传失败

**错误**：`存储空间未开通`

**解决方案**：
1. 在腾讯云控制台创建 `avatars` 文件夹
2. 权限设置为 **所有用户可读写**

---

## 📊 云函数列表

| 云函数 | 功能 | 状态 |
|--------|------|------|
| `login` | 用户登录 | ✅ 已创建 |
| `updateUserInfo` | 更新用户信息 | ⏳ 待上传 |
| `updateHighestLevel` | 更新最高关卡 | ⏳ 待上传 |
| `getRankList` | 获取排行榜 | ⏳ 待上传 |
| `addPoints` | 添加积分 | ⏳ 待上传 |
| `consumePoints` | 消耗积分 | ⏳ 待上传 |

---

## 🎯 完成检查清单

部署完成后，请确认以下事项：

- [ ] 云开发环境已关联
- [ ] 数据库集合 `users` 已创建
- [ ] 云存储目录 `avatars` 已创建
- [ ] 6 个云函数已上传
- [ ] 小程序已编译
- [ ] 小程序已上传
- [ ] 登录功能测试通过
- [ ] 排行榜功能测试通过
- [ ] 游戏功能测试正常

---

## 📚 相关文档

- **详细部署指南**：`TENCENT_CLOUD_DEPLOYMENT.md`
- **腾讯云开发控制台**：https://console.cloud.tencent.com/tcb
- **腾讯云开发文档**：https://docs.cloudbase.net/

---

## 🆘 获取帮助

如果遇到问题：

1. 查看本指南的 **常见问题** 章节
2. 查看云函数日志
3. 查看数据库日志
4. 随时告诉我你的问题！

---

## 🎉 开始部署吧！

**预计时间**：10-15 分钟

**立即开始**：
1. 打开微信开发者工具
2. 关联云开发环境
3. 创建数据库和存储
4. 上传云函数
5. 编译和上传小程序

**祝你部署顺利！** 🚀
