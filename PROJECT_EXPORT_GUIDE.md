# 项目导出和部署指南

本指南帮助你将项目导出到本地，并使用微信开发者工具进行开发和测试。

---

## 📦 项目信息

**项目名称**：拼图小游戏 - 腾讯云开发版本

**环境 ID**：`db-2gaczaywd186652b`

**技术栈**：
- 前端：Taro + React + TypeScript + Tailwind CSS
- 云开发：腾讯云开发（云函数 + 云数据库 + 云存储）
- 状态管理：Zustand
- 图标库：Lucide React Taro

---

## 🚀 快速开始（推荐方式）

### 步骤 1：克隆项目到本地（5分钟）

在 Windows CMD 或 PowerShell 中执行：

```bash
# 进入桌面
cd Desktop

# 克隆项目
git clone https://github.com/dec24ss/coze-mini-program.git

# 进入项目目录
cd coze-mini-program

# 安装 pnpm（如果没有）
npm install -g pnpm

# 安装依赖
pnpm install
```

---

### 步骤 2：编译小程序（2分钟）

```bash
# 编译小程序
pnpm build:weapp
```

等待编译完成，确认 `dist` 目录已生成。

**预期输出**：
```
📦 Compiling...
✅ Compile success in 30s
📦 Output: dist/
```

---

### 步骤 3：用微信开发者工具打开（2分钟）

1. **打开微信开发者工具**
2. **点击导入项目**
3. **选择项目目录**
   - 路径：`Desktop\coze-mini-program`
   - **注意**：选择项目根目录，不是 `dist` 目录
4. **填写项目信息**
   - 项目名称：`拼图小游戏`
   - AppID：你的小程序 AppID（或测试号）
   - 开发模式：**小程序**
   - 后端服务：**不使用云服务**
5. **点击导入**

**为什么选择项目根目录？**

项目根目录下的 `project.config.json` 配置了：
```json
{
  "miniprogramRoot": "dist/",
  "cloudfunctionRoot": "cloudfunctions/",
  ...
}
```

这样微信开发者工具会自动：
- 使用 `dist/` 目录作为小程序代码
- 识别 `cloudfunctions/` 目录下的云函数

---

### 步骤 4：关联云开发环境（2分钟）

1. **点击顶部菜单 "云开发"**
2. **点击 "开通"**
3. **选择环境**：`db-2gaczaywd186652b`
4. **点击 "确定"**

如果提示环境不存在，请前往腾讯云控制台创建环境。

---

### 步骤 5：上传云函数（10分钟）

需要上传 6 个云函数：

| 云函数 | 说明 |
|--------|------|
| `login` | 用户登录 |
| `updateUserInfo` | 更新用户信息 |
| `updateHighestLevel` | 更新最高关卡 |
| `getRankList` | 获取排行榜 |
| `addPoints` | 添加积分 |
| `consumePoints` | 消耗积分 |

**每个云函数的操作步骤**：

1. 在微信开发者工具中，项目根目录右键
2. 选择 **新建 Node.js 云函数**
3. 输入云函数名称（如 `login`）
4. 打开新建的云函数目录：`cloudfunctions/login/index.js`
5. 复制项目源码中的云函数代码
6. 粘贴到 `index.js` 中
7. 保存文件
8. 右键云函数文件夹
9. 选择 **上传并部署：云端安装依赖**
10. 等待部署完成（约 1-2 分钟）

**快速复制方式**：

你可以一次性创建所有云函数，然后批量复制代码：

```bash
# 在 Windows PowerShell 中
# 创建所有云函数目录
New-Item -ItemType Directory -Force -Path cloudfunctions\login
New-Item -ItemType Directory -Force -Path cloudfunctions\updateUserInfo
New-Item -ItemType Directory -Force -Path cloudfunctions\updateHighestLevel
New-Item -ItemType Directory -Force -Path cloudfunctions\getRankList
New-Item -ItemType Directory -Force -Path cloudfunctions\addPoints
New-Item -ItemType Directory -Force -Path cloudfunctions\consumePoints

# 创建 index.js 文件
New-Item -ItemType File -Force -Path cloudfunctions\login\index.js
# ... 其他云函数同理
```

---

### 步骤 6：创建数据库和存储（3分钟）

#### 6.1 创建数据库集合

1. 打开腾讯云控制台：https://console.cloud.tencent.com/tcb
2. 选择环境：`db-2gaczaywd186652b`
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

#### 6.2 创建存储目录

1. 在腾讯云控制台
2. 进入 **存储**
3. 点击 **新建文件夹**
4. 文件夹名称：`avatars`
5. 点击 **确定**

---

### 步骤 7：测试云函数（2分钟）

在微信开发者工具控制台中执行：

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

### 步骤 8：预览小程序（2分钟）

1. 点击微信开发者工具顶部菜单的 **预览**
2. 生成预览二维码
3. 使用微信扫描二维码
4. 在手机中测试小程序

---

## ⚠️ 重要配置说明

### 1. project.config.json

**关键配置**：

```json
{
  "miniprogramRoot": "dist/",
  "cloudfunctionRoot": "cloudfunctions/",
  "cloudfunctionTemplateRoot": "cloudfunctionTemplate/",
  "cloudbaseRoot": "./",
  ...
}
```

**为什么这样配置？**

- `miniprogramRoot: "dist/"`：Taro 编译后的代码在 `dist` 目录
- `cloudfunctionRoot: "cloudfunctions/"`：云函数代码在 `cloudfunctions` 目录
- `cloudbaseRoot: "./"`：云开发配置在项目根目录

**修改 AppID**：

将 `appid` 替换为你的小程序 AppID：

```json
{
  "appid": "your_appid_here",  // 替换为你的 AppID
  ...
}
```

---

### 2. cloudbaserc.json

**关键配置**：

```json
{
  "envId": "db-2gaczaywd186652b",
  ...
}
```

**环境 ID 说明**：

这是腾讯云开发环境的唯一标识，用于连接云函数、云数据库和云存储。

---

### 3. src/app.ts

**关键配置**：

```typescript
if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
  try {
    Taro.cloud.init({
      env: 'db-2gaczaywd186652b',  // 腾讯云环境 ID
      traceUser: true
    })
    console.log('腾讯云开发环境初始化成功')
  } catch (error) {
    console.error('腾讯云开发环境初始化失败:', error)
  }
}
```

**为什么要在运行时初始化？**

- 只在小程序端初始化云开发
- H5 端不需要云开发功能
- 提供错误处理，避免影响页面加载

---

## 🔄 开发流程

### 修改代码

1. 修改 `src/` 目录下的源代码
2. 重新编译：`pnpm build:weapp`
3. 刷新微信开发者工具

### 修改云函数

1. 修改 `cloudfunctions/` 目录下的云函数代码
2. 在微信开发者工具中右键云函数文件夹
3. 选择 **上传并部署：云端安装依赖**
4. 等待部署完成

### 开发模式（可选）

如果需要热更新，可以使用开发模式：

```bash
# 启动开发模式
pnpm dev:weapp
```

但要注意：
- 开发模式不会自动刷新微信开发者工具
- 需要手动保存和刷新

---

## 📋 完整检查清单

### 项目配置

- [ ] `project.config.json` 已配置（`miniprogramRoot: dist/`）
- [ ] `cloudbaserc.json` 环境 ID 正确：`db-2gaczaywd186652b`
- [ ] `src/app.ts` 云开发初始化代码正确
- [ ] AppID 已替换为你的小程序 AppID

### 云函数

- [ ] `login` 云函数已上传
- [ ] `updateUserInfo` 云函数已上传
- [ ] `updateHighestLevel` 云函数已上传
- [ ] `getRankList` 云函数已上传
- [ ] `addPoints` 云函数已上传
- [ ] `consumePoints` 云函数已上传

### 数据库和存储

- [ ] 数据库集合 `users` 已创建
- [ ] 存储目录 `avatars` 已创建

### 小程序

- [ ] 小程序已编译（`dist` 目录存在）
- [ ] 云开发已关联
- [ ] 登录功能测试通过
- [ ] 游戏功能测试通过
- [ ] 排行榜功能测试通过

---

## ⏱️ 预计时间

| 步骤 | 预计时间 |
|------|----------|
| 克隆项目 | 5 分钟 |
| 安装依赖 | 3 分钟 |
| 编译小程序 | 2 分钟 |
| 用微信开发者工具打开 | 2 分钟 |
| 关联云开发环境 | 2 分钟 |
| 上传 6 个云函数 | 10 分钟 |
| 创建数据库和存储 | 3 分钟 |
| 测试云函数 | 2 分钟 |
| 预览小程序 | 2 分钟 |
| **总计** | **31 分钟** |

---

## 🆘 常见问题

### 问题 1：编译失败

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
3. 检查环境 ID 是否正确：`db-2gaczaywd186652b`
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

### 问题 4：微信开发者工具显示空白

**可能原因**：
- `project.config.json` 配置错误
- `dist` 目录不存在或编译失败

**解决方案**：
1. 检查 `project.config.json` 中的 `miniprogramRoot` 是否为 `dist/`
2. 重新编译：`pnpm build:weapp`
3. 刷新微信开发者工具

---

### 问题 5：云函数上传失败

**错误信息**：
```
Error: upload failed
```

**解决方案**：
1. 检查网络连接
2. 检查云开发环境是否正常
3. 尝试重新上传
4. 在腾讯云控制台查看云函数状态

---

### 问题 6：H5 端无法使用云开发

**说明**：
云开发功能仅支持小程序端，H5 端需要使用其他方式（如直接调用腾讯云 API）。

**解决方案**：
1. 在 `src/app.ts` 中添加平台检测
2. H5 端使用模拟数据或跳转功能

---

## 📚 相关文档

| 文档 | 用途 |
|------|------|
| `PROJECT_CHECKLIST.md` | 项目检查清单 |
| `CLOUD_SETUP_GUIDE.md` | 云开发配置详细步骤 |
| `QUICK_START.md` | 快速部署指南 |
| `TENCENT_CLOUD_DEPLOYMENT.md` | 腾讯云官方文档风格 |
| `README.md` | 项目说明文档 |

---

## 🎉 开始吧！

**现在就按照以下步骤操作**：

1. 打开 Windows CMD 或 PowerShell
2. 执行 `git clone` 克隆项目
3. 执行 `pnpm install` 安装依赖
4. 执行 `pnpm build:weapp` 编译小程序
5. 用微信开发者工具打开项目根目录
6. 关联云开发环境
7. 上传 6 个云函数
8. 创建数据库和存储
9. 测试功能

**预计 31 分钟完成！** 🚀

---

## 📞 获取帮助

如果遇到问题：

1. 查看 **常见问题** 章节
2. 查看 **相关文档** 中的详细指南
3. 在微信开发者工具中查看控制台日志
4. 在腾讯云控制台中查看云函数日志
5. 联系项目维护者

---

**祝你开发顺利！** 💪
