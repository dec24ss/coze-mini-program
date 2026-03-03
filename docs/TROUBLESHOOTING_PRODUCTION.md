# 线上版图片和数据库加载失败问题 - 解决方案

## 📋 问题现象

- ✅ **开发版**：图片和数据库加载正常
- ❌ **线上版**：图片和数据库加载失败

---

## 🔍 问题原因

### 原因1：微信小程序域名白名单未配置

**影响**：图片加载失败

**详细说明**：
- 项目使用的图片来源于 Picsum Photos（`https://picsum.photos/...`）
- 微信小程序正式版必须在公众平台配置域名白名单才能加载外部资源
- 开发版可以在开发者工具中勾选"不校验合法域名"绕过此限制
- 线上版无法绕过，必须严格配置

### 原因2：前端环境变量未配置

**影响**：数据库加载失败（API请求失败）

**详细说明**：
- `PROJECT_DOMAIN` 环境变量未设置
- 导致所有API请求的域名前缀为空，请求路径错误
- 构建产物中的 `PROJECT_DOMAIN` 变成空字符串

---

## ✅ 解决方案

### 方案1：配置微信小程序域名白名单

**详细配置指南**：[`docs/WECHAT_DOMAIN_CONFIG.md`](docs/WECHAT_DOMAIN_CONFIG.md)

**快速操作步骤**：

1. 登录微信公众平台：https://mp.weixin.qq.com
2. 进入「开发」→「开发管理」→「开发设置」→「服务器域名」
3. 配置以下域名：

**downloadFile 合法域名**：
```
https://picsum.photos
https://api.dicebear.com
https://images.unsplash.com
https://assets.mixkit.co
```

**说明**：
- `picsum.photos` - 拼图图片（随机高质量图片，共100张）
- `api.dicebear.com` - 用户默认头像生成
- `images.unsplash.com` - 备用图片
- `assets.mixkit.co` - 游戏音效文件

**request 合法域名**：
```
https://your-server.com
https://egutrdawrbziyklwnuov.supabase.co
```

**uploadFile 合法域名**：
```
https://your-server.com
https://egutrdawrbziyklwnuov.supabase.co
```

**注意**：请将 `https://your-server.com` 替换为你实际的后端服务器域名。

### 方案2：配置前端环境变量

**已创建文件**：`.env.local`

**内容**：
```bash
# 项目域名（后端API地址）
# 本地开发：http://localhost:3000
# 生产环境：https://your-server.com（⚠️ 必须修改为你的实际后端服务器地址！）
PROJECT_DOMAIN=http://localhost:3000
```

**⚠️ 重要**：生产环境部署时，必须修改 `PROJECT_DOMAIN` 为你的实际后端服务器域名！

**示例**：
```bash
# 假设你的后端部署在 https://api.example.com
PROJECT_DOMAIN=https://api.example.com
```

### 方案3：重新构建前端

**已完成**：前端已使用新环境变量重新构建

**验证**：构建产物中已正确注入 `PROJECT_DOMAIN`
```javascript
// dist/common.js
const o=e=>e.startsWith("http://")||e.startsWith("https://")?e:`http://localhost:3000${e}`;
```

---

## 🚀 后续操作步骤

### 1. 配置域名白名单（必须）

按照上面的"方案1"，在微信公众平台配置域名白名单。

### 2. 修改环境变量（必须）

编辑 `.env.local` 文件，将 `PROJECT_DOMAIN` 改为你的实际后端服务器域名：

```bash
# 示例
PROJECT_DOMAIN=https://your-actual-server.com
```

### 3. 重新构建并上传

```bash
# 重新构建
pnpm build:weapp

# 上传小程序
# 使用微信开发者工具打开 dist 目录，然后上传
```

### 4. 测试验证

在微信开发者工具中：
1. 取消勾选「不校验合法域名」
2. 预览小程序
3. 测试图片加载和数据库访问
4. 确认所有功能正常

---

## 📊 问题总结

| 问题 | 原因 | 解决方案 | 状态 |
|------|------|----------|------|
| 图片加载失败 | 微信小程序域名白名单未配置 | 配置 downloadFile 域名白名单 | ⚠️ 待用户配置 |
| 数据库加载失败 | PROJECT_DOMAIN 环境变量未设置 | 创建 .env.local 文件并配置 | ✅ 已修复 |

---

## 📝 相关文档

- **详细配置指南**：[`docs/WECHAT_DOMAIN_CONFIG.md`](docs/WECHAT_DOMAIN_CONFIG.md)
- **部署文档**：[`DEPLOYMENT.md`](DEPLOYMENT.md)
- **环境变量示例**：[`.env.example`](.env.example)

---

## ⚠️ 重要提醒

1. **域名白名单配置必须在实际部署前完成**
2. **PROJECT_DOMAIN 必须修改为实际的后端服务器域名**
3. **所有域名必须使用 HTTPS 协议**
4. **配置完成后需要重新构建并上传小程序**

---

**问题解决时间**: 2026-03-02
**文档版本**: v1.0
