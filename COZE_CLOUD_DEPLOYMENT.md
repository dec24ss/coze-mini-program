# 扣子编程 + 腾讯云部署指南

本指南帮助你在扣子编程环境中部署微信小程序，使用腾讯云开发（云函数 + 云数据库 + 云存储）。

---

## 🎯 部署架构

**扣子编程**：
- 前端开发环境（Taro + React + TypeScript）
- 代码编辑和管理
- 项目构建和编译

**腾讯云开发**：
- 云函数（后端逻辑）
- 云数据库（数据存储）
- 云存储（文件存储）

**微信小程序**：
- 小程序前端
- 用户交互界面

---

## 📋 前置要求

### 1. 扣子编程环境

- 已注册扣子编程账号
- 已创建项目

### 2. 腾讯云开发

- 已注册腾讯云账号
- 已开通云开发服务
- 已创建环境 ID：`cloudbase-8g1wqiy0823dea4a`

### 3. 微信小程序

- 已注册微信小程序
- 已获取 AppID

---

## 🚀 部署步骤

### 步骤 1：导入项目到扣子编程（2 分钟）

1. 登录扣子编程
2. 创建新项目或导入现有项目
3. 上传项目文件（或使用 Git 克隆）

**项目地址**：https://github.com/dec24ss/coze-mini-program.git

---

### 步骤 2：安装依赖（3 分钟）

在扣子编程终端中执行：

```bash
# 安装依赖
pnpm install

# 验证安装
pnpm --version
node --version
```

**预期输出**：
```
pnpm 9.0.0
node v18.x.x
```

---

### 步骤 3：编译小程序（2 分钟）

在扣子编程终端中执行：

```bash
# 编译小程序
pnpm build:weapp
```

**预期输出**：
```
📦 Compiling...
✓ 176 modules transformed.
✓ built in 7.13s
```

**检查点**：
- 确认 `dist` 目录已生成
- 确认编译成功无错误

---

### 步骤 4：下载编译产物（1 分钟）

在扣子编程中：

1. 找到 `dist` 目录
2. 将 `dist` 目录打包为压缩文件
3. 下载到本地

**或使用命令行**：

```bash
# 打包 dist 目录
tar -czf weapp-dist.tar.gz dist/

# 下载文件（根据扣子编程的具体操作）
```

---

### 步骤 5：用微信开发者工具打开（2 分钟）

1. 在本地创建项目目录：`coze-mini-program`
2. 解压 `weapp-dist.tar.gz` 到项目目录
3. 将 `cloudfunctions` 目录也复制到项目目录
4. 打开微信开发者工具
5. 导入项目
6. 填写项目信息：
   - 项目名称：`拼图小游戏`
   - AppID：你的小程序 AppID
   - 开发模式：**小程序**
   - 后端服务：**不使用云服务**
7. 点击导入

---

### 步骤 6：配置腾讯云开发（5 分钟）

#### 6.1 关联云开发环境

在微信开发者工具中：

1. 点击顶部菜单 "云开发"
2. 点击 "开通"
3. 选择环境：`cloudbase-8g1wqiy0823dea4a`
4. 点击 "确定"

#### 6.2 创建数据库集合

在腾讯云控制台中：

1. 打开腾讯云控制台：https://console.cloud.tencent.com/tcb
2. 选择环境：`cloudbase-8g1wqiy0823dea4a`
3. 进入 **数据库**
4. 点击 **新建集合**
5. 集合名称：`users`
6. 权限设置：**所有用户可读写**
7. 点击 **确定**

**集合结构**：

```json
{
  "_id": "自动生成",
  "openid": "用户唯一标识",
  "nickname": "用户昵称",
  "avatar_url": "头像 URL",
  "highest_level": 0,
  "points": 0,
  "created_at": "创建时间",
  "updated_at": "更新时间"
}
```

#### 6.3 创建存储目录

1. 在腾讯云控制台
2. 进入 **存储**
3. 点击 **新建文件夹**
4. 文件夹名称：`avatars`
5. 点击 **确定**

---

### 步骤 7：上传云函数（10 分钟）

在微信开发者工具中：

#### 7.1 创建云函数

1. 右键 `cloudfunctions` 目录
2. 选择 **新建 Node.js 云函数**
3. 输入云函数名称（如 `login`）
4. 点击确定

#### 7.2 复制云函数代码

1. 打开新建的云函数目录：`cloudfunctions/login/index.js`
2. 从扣子编程中复制对应的云函数代码
3. 粘贴到 `index.js` 中
4. 保存文件

#### 7.3 上传云函数

1. 右键云函数文件夹
2. 选择 **上传并部署：云端安装依赖**
3. 等待部署完成（约 1-2 分钟）

**重复以上步骤，上传所有 6 个云函数**：

| 云函数 | 说明 |
|--------|------|
| `login` | 用户登录 |
| `updateUserInfo` | 更新用户信息 |
| `updateHighestLevel` | 更新最高关卡 |
| `getRankList` | 获取排行榜 |
| `addPoints` | 添加积分 |
| `consumePoints` | 消耗积分 |

---

### 步骤 8：测试功能（2 分钟）

在微信开发者工具控制台执行：

```javascript
// 测试登录
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

// 测试排行榜
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
✅ 登录成功: { code: 200, msg: 'success', data: { ... } }
✅ 排行榜数据: { code: 200, msg: 'success', data: [...] }
```

---

### 步骤 9：预览和发布（2 分钟）

#### 9.1 预览小程序

1. 点击微信开发者工具顶部菜单的 **预览**
2. 生成预览二维码
3. 使用微信扫描二维码
4. 在手机中测试小程序

#### 9.2 提交审核

1. 点击微信开发者工具顶部菜单的 **上传**
2. 填写版本号和备注
3. 登录微信小程序后台
4. 提交审核

---

## 🔧 扣子编程开发流程

### 1. 修改代码

在扣子编程中：

1. 修改 `src/` 目录下的源代码
2. 保存文件
3. 触发自动编译（如果配置了热更新）

### 2. 重新编译

```bash
# 编译小程序
pnpm build:weapp
```

### 3. 下载更新

1. 下载 `dist` 目录
2. 解压到本地项目目录
3. 刷新微信开发者工具

### 4. 测试验证

1. 在微信开发者工具中测试
2. 确认功能正常
3. 准备发布

---

## 📦 云函数说明

### 云函数列表

| 云函数 | 说明 | 参数 | 返回 |
|--------|------|------|------|
| `login` | 用户登录 | `openid`, `nickname`, `avatar_url` | 用户信息 |
| `updateUserInfo` | 更新用户信息 | `openid`, `nickname`, `avatar_url` | 更新结果 |
| `updateHighestLevel` | 更新最高关卡 | `openid`, `level` | 更新结果 |
| `getRankList` | 获取排行榜 | `limit` | 排行榜列表 |
| `addPoints` | 添加积分 | `openid`, `points` | 积分变更 |
| `consumePoints` | 消耗积分 | `openid`, `points` | 积分变更 |

### 云函数调用示例

```typescript
// 在 Taro 中调用云函数
import Taro from '@tarojs/taro'

// 调用登录云函数
const loginResult = await Taro.cloud.callFunction({
  name: 'login',
  data: {
    openid: 'user_001',
    nickname: '张三',
    avatar_url: ''
  }
})

console.log(loginResult.result)

// 调用排行榜云函数
const rankResult = await Taro.cloud.callFunction({
  name: 'getRankList',
  data: { limit: 10 }
})

console.log(rankResult.result.data)
```

---

## ⚠️ 注意事项

### 1. 环境 ID

**环境 ID**：`cloudbase-8g1wqiy0823dea4a`

确保以下文件中的环境 ID 正确：
- `cloudbaserc.json`
- `src/app.ts`

### 2. 云开发初始化

在 `src/app.ts` 中，云开发初始化代码：

```typescript
if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
  try {
    Taro.cloud.init({
      env: 'cloudbase-8g1wqiy0823dea4a',  // 确认环境 ID 正确
      traceUser: true
    })
    console.log('腾讯云开发环境初始化成功')
  } catch (error) {
    console.error('腾讯云开发环境初始化失败:', error)
  }
}
```

### 3. 云函数上传

每次修改云函数代码后，需要：

1. 修改 `cloudfunctions/` 中的代码
2. 在微信开发者工具中重新上传云函数
3. 选择 "上传并部署：云端安装依赖"

### 4. 数据库权限

确保数据库集合 `users` 的权限设置为 **所有用户可读写**，否则云函数无法操作数据库。

---

## 🆘 常见问题

### 问题 1：扣子编程中编译失败

**错误信息**：
```
Error: Cannot find module 'xxx'
```

**解决方案**：
```bash
# 清理缓存
rm -rf node_modules pnpm-lock.yaml

# 重新安装
pnpm install

# 重新编译
pnpm build:weapp
```

---

### 问题 2：云函数调用失败

**错误信息**：
```
Error: cloud function is not found
```

**解决方案**：
1. 检查云开发环境是否已关联
2. 检查云函数是否已上传
3. 检查环境 ID 是否正确：`cloudbase-8g1wqiy0823dea4a`
4. 在微信开发者工具中查看云函数日志

---

### 问题 3：数据库操作失败

**错误信息**：
```
Error: collection not found
```

**解决方案**：
1. 检查数据库集合 `users` 是否已创建
2. 检查权限是否设置为"所有用户可读写"
3. 查看云函数日志

---

### 问题 4：下载 dist 目录失败

**解决方案**：

**方式 1：使用扣子编程的下载功能**
1. 在扣子编程文件管理器中
2. 选中 `dist` 目录
3. 点击下载

**方式 2：使用命令行打包**
```bash
# 打包
tar -czf weapp-dist.tar.gz dist/

# 下载压缩包
```

**方式 3：使用 Git**
```bash
# 提交到 Git
git add dist/
git commit -m "Update dist"
git push

# 在本地克隆
git pull
```

---

## 📚 相关文档

| 文档 | 说明 |
|------|------|
| `PROJECT_EXPORT_GUIDE.md` | 项目导出和部署指南 |
| `PROJECT_CHECKLIST.md` | 项目检查清单 |
| `QUICK_START.md` | 快速开始指南 |
| `README.md` | 项目说明文档 |
| `CLOUD_SETUP_GUIDE.md` | 云开发配置详细步骤 |

---

## ⏱️ 预计时间

| 步骤 | 预计时间 |
|------|----------|
| 导入项目到扣子编程 | 2 分钟 |
| 安装依赖 | 3 分钟 |
| 编译小程序 | 2 分钟 |
| 下载编译产物 | 1 分钟 |
| 用微信开发者工具打开 | 2 分钟 |
| 配置腾讯云开发 | 5 分钟 |
| 上传云函数 | 10 分钟 |
| 测试功能 | 2 分钟 |
| 预览和发布 | 2 分钟 |
| **总计** | **29 分钟** |

---

## 🎉 完成

恭喜！你已经成功在扣子编程环境中部署了微信小程序，并使用腾讯云开发作为后端服务。

**下一步**：
- 在扣子编程中继续开发
- 重新编译并下载更新
- 在微信开发者工具中测试
- 发布小程序

---

**祝你开发顺利！** 🚀✨
