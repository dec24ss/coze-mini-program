# 拼图小程序导出与部署指南

## 📦 项目导出到微信开发者工具

### 步骤 1: 配置云开发（关键）

在 Coze 环境中，云开发默认是**关闭**的（避免 BigInt 兼容性问题）。导出到本地前需要**手动开启**：

**文件：`src/cloudbase/index.ts`**
```typescript
// ⬇️ 修改这个配置：将 false 改为 true
const USE_CLOUDBASE = true
```

### 步骤 2: 配置云开发环境 ID

**文件：`src/cloudbase/index.ts`**
```typescript
// 填入你的云开发环境 ID
const envId = 'your-env-id' // 替换为你的云开发环境 ID
```

### 步骤 3: 构建微信小程序

```bash
# 构建小程序版本
pnpm build:weapp
```

### 步骤 4: 导入微信开发者工具

1. 打开微信开发者工具
2. 选择「导入项目」
3. 项目目录选择：`/workspace/projects/dist`
4. AppID 选择你的小程序 AppID
5. 点击「导入」

## ☁️ 云开发配置

### 1. 开通云开发

1. 在微信开发者工具中，点击顶部「云开发」按钮
2. 如果是首次使用，按提示开通云开发（免费版即可）
3. 创建环境，记录环境 ID

### 2. 创建数据库集合

在云开发控制台 -> 数据库 -> 新建集合：

| 集合名称 | 说明 | 权限设置 |
|---------|------|---------|
| `users` | 用户信息 | 所有用户可读，仅创建者可写 |
| `rank` | 排行榜 | 所有用户可读，仅创建者可写 |

### 3. 上传和部署云函数

#### 3.1 创建云函数目录结构

在项目根目录创建 `cloudfunctions` 文件夹（与 `src` 同级）：

```
cloudfunctions/
├── users/
│   ├── index.js
│   └── package.json
├── rank/
│   ├── index.js
│   └── package.json
└── updateUser/
    ├── index.js
    └── package.json
```

#### 3.2 users 云函数

**文件：`cloudfunctions/users/index.js`**
```javascript
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
```

**文件：`cloudfunctions/users/package.json`**
```json
{
  "name": "users",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "dependencies": {
    "wx-server-sdk": "~2.6.3"
  }
}
```

#### 3.3 rank 云函数

**文件：`cloudfunctions/rank/index.js`**
```javascript
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const { action, openid, level, score, avatar_url, nickname } = event

  try {
    if (action === 'getTop100') {
      // 获取前100名
      const rankRes = await db.collection('rank')
        .orderBy('score', 'asc')
        .limit(100)
        .get()
      
      return {
        success: true,
        data: rankRes.data
      }
    } else if (action === 'submitScore') {
      // 提交分数
      const existingRes = await db.collection('rank').where({
        openid,
        level
      }).get()
      
      if (existingRes.data.length > 0) {
        const existing = existingRes.data[0]
        if (score < existing.score) {
          // 新纪录，更新
          await db.collection('rank').doc(existing._id).update({
            data: {
              score,
              avatar_url: avatar_url || existing.avatar_url,
              nickname: nickname || existing.nickname,
              updated_at: new Date()
            }
          })
        }
      } else {
        // 新纪录
        await db.collection('rank').add({
          data: {
            openid,
            level,
            score,
            avatar_url: avatar_url || '',
            nickname: nickname || '微信用户',
            created_at: new Date(),
            updated_at: new Date()
          }
        })
      }
      
      return {
        success: true
      }
    }
    
    return {
      success: false,
      error: 'Unknown action'
    }
  } catch (error) {
    console.error('Error in rank function:', error)
    return {
      success: false,
      error: error.message
    }
  }
}
```

**文件：`cloudfunctions/rank/package.json`**
```json
{
  "name": "rank",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "dependencies": {
    "wx-server-sdk": "~2.6.3"
  }
}
```

#### 3.4 updateUser 云函数

**文件：`cloudfunctions/updateUser/index.js`**
```javascript
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const { openid, avatar_url, nickname, level_unlocked, best_scores } = event

  try {
    const updateData = {
      updated_at: new Date()
    }
    
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url
    if (nickname !== undefined) updateData.nickname = nickname
    if (level_unlocked !== undefined) updateData.level_unlocked = level_unlocked
    if (best_scores !== undefined) updateData.best_scores = best_scores
    
    // 更新用户
    await db.collection('users').where({
      openid
    }).update({
      data: updateData
    })
    
    // 获取更新后的用户
    const userRes = await db.collection('users').where({
      openid
    }).get()
    
    return {
      success: true,
      data: userRes.data[0]
    }
  } catch (error) {
    console.error('Error in updateUser function:', error)
    return {
      success: false,
      error: error.message
    }
  }
}
```

**文件：`cloudfunctions/updateUser/package.json`**
```json
{
  "name": "updateUser",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "dependencies": {
    "wx-server-sdk": "~2.6.3"
  }
}
```

#### 3.5 上传云函数

1. 在微信开发者工具左侧文件树中找到 `cloudfunctions` 文件夹
2. 右键点击每个云函数文件夹（`users`、`rank`、`updateUser`）
3. 选择「上传并部署：云端安装依赖」
4. 等待部署完成（每个云函数约 1-2 分钟）

### 4. 配置云存储（用于头像）

1. 在云开发控制台 -> 存储
2. 创建文件夹：`avatars`
3. 权限设置：所有用户可读，仅创建者可写

## 🚀 部署检查清单

- [ ] 已修改 `src/cloudbase/index.ts` 中的 `USE_CLOUDBASE = true`
- [ ] 已填入正确的云开发环境 ID
- [ ] 已运行 `pnpm build:weapp` 构建成功
- [ ] 已在微信开发者工具中导入项目
- [ ] 已开通云开发并创建环境
- [ ] 已创建数据库集合：`users`、`rank`
- [ ] 已创建并部署云函数：`users`、`rank`、`updateUser`
- [ ] 已配置云存储
- [ ] 已测试微信登录功能
- [ ] 已测试游戏功能
- [ ] 已测试排行榜功能

## 🔧 常见问题

### Q: 云函数部署失败？
A: 检查 `package.json` 中的依赖是否正确，确保使用 `wx-server-sdk ~2.6.3` 版本。

### Q: 数据库操作无权限？
A: 检查数据库集合的权限设置，建议设置为「所有用户可读，仅创建者可写」。

### Q: 头像上传失败？
A: 确保云存储已创建 `avatars` 文件夹，且权限设置正确。

### Q: 排行榜不显示？
A: 确认 `rank` 云函数已正确部署，且数据库中有数据。

## 📞 技术支持

如遇问题，请检查：
1. 微信开发者工具控制台的错误信息
2. 云开发控制台的云函数日志
3. 数据库操作记录
