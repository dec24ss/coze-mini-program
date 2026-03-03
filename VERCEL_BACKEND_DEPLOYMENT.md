# Vercel 后端部署指南

本指南介绍如何将 NestJS 后端单独部署到 Vercel。

---

## 📋 前置要求

- GitHub 账号
- Vercel 账号（使用 GitHub 登录）
- 已将代码推送到 GitHub 仓库

---

## 🚀 部署步骤

### 步骤 1：访问 Vercel

打开：https://vercel.com

### 步骤 2：导入项目

1. 点击 **Add New** → **Project**
2. 点击 **Import** GitHub 仓库
3. 选择 `dec24ss/coze-mini-program` 仓库
4. 点击 **Import**

### 步骤 3：配置项目设置

**Project Name（项目名称）**
```
coze-mini-program-api
```

**Root Directory（根目录）** 🔴 重要
```
server
```

**Framework Preset（框架预设）**
```
NestJS
```

**Build Command（构建命令）**
```
npm run build
```

**Output Directory（输出目录）**
```
dist
```

**Install Command（安装命令）**
```
npm install
```

### 步骤 4：配置环境变量

在 **Environment Variables** 部分添加以下环境变量：

| Key | Value |
|-----|-------|
| `COZE_SUPABASE_URL` | `https://egutrdawrbziyklwnuov.supabase.co` |
| `COZE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVndXRyZGF3cmJ6aXlrbHdudW92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0MjUwMTEsImV4cCI6MjA4ODAwMTAxMX0.PKGOVO2ItYvesw714VRdGxuTjGgNw5WU2LHTDLObQfs` |
| `NODE_ENV` | `production` |

**注意**：
- 点击眼睛图标查看密码
- 点击齿轮图标设置为 `Environment`（所有环境都可用）

### 步骤 5：部署

点击 **Deploy** 按钮

等待 2-3 分钟，部署完成后会获得一个域名：

```
https://coze-mini-program-api-xxx.vercel.app
```

---

## 🧪 验证部署

### 测试健康检查接口

```bash
curl https://your-vercel-domain.vercel.app/api/health
```

预期响应：
```json
{
  "status": "success",
  "data": "2024-01-01T00:00:00.000Z"
}
```

### 测试登录接口

```bash
curl -X POST https://your-vercel-domain.vercel.app/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"openid":"test_vercel","nickname":"Vercel测试"}'
```

预期响应：
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "userId": "xxx",
    "openid": "test_vercel",
    "nickname": "Vercel测试",
    "avatarUrl": ""
  }
}
```

---

## 🔧 更新前端配置

部署成功后，需要更新前端配置以使用新的 Vercel 后端域名。

### 修改 `src/config/api.ts`

```typescript
// 🔴 部署后请修改这里：将域名替换为你的 Vercel 域名
// 例如：https://coze-mini-program-api-abc123.vercel.app
const RENDER_API_URL = 'https://your-vercel-domain.vercel.app'

// 本地开发环境（开发时使用）
const LOCAL_API_URL = 'http://localhost:3000'
```

### 提交修改

```bash
git add src/config/api.ts
git commit -m "chore: 更新 Vercel 后端域名"
git push origin main
```

---

## 📱 配置微信小程序域名（可选）

如果要在微信小程序中使用，需要将 Vercel 域名添加到微信小程序合法域名白名单。

### 步骤

1. 登录微信公众平台：https://mp.weixin.qq.com
2. 进入 **开发** → **开发管理** → **开发设置**
3. 找到 **服务器域名**
4. 在 **request 合法域名** 中添加：
   ```
   https://your-vercel-domain.vercel.app
   ```
5. 保存并等待生效（约 10 分钟）

---

## ⚠️ 常见问题

### 问题 1：构建失败 - Build Error

**原因**：依赖安装失败

**解决方案**：
- 检查 `server/package.json` 是否正确
- 确保所有依赖都正确列出
- 查看 Vercel 的构建日志

### 问题 2：启动失败 - Cannot start

**原因**：入口文件配置错误

**解决方案**：
- 确认 `server/vercel.json` 配置正确
- 检查 `server/src/vercel.ts` 是否存在
- 确认 TypeScript 编译输出目录为 `dist`

### 问题 3：API 调用失败 - 404 Not Found

**原因**：路由配置错误

**解决方案**：
- 确认 `server/vercel.json` 中的 routes 配置正确
- 确认 `server/src/main.ts` 中设置了全局前缀 `api`

### 问题 4：环境变量未生效

**原因**：环境变量配置错误

**解决方案**：
- 重新配置环境变量
- 确保变量名和值都正确
- 重启服务

### 问题 5：Supabase 连接失败

**原因**：Supabase URL 或 Key 错误

**解决方案**：
- 检查环境变量配置
- 确认 Supabase 项目状态正常
- 测试 Supabase 连接

### 问题 6：CORS 错误

**原因**：跨域配置问题

**解决方案**：
- 检查 `server/src/main.ts` 中的 CORS 配置
- 确认 `app.enableCors()` 已调用

---

## 🔄 自动部署

Vercel 支持自动部署，配置完成后：

- 每次推送到 `main` 分支会自动触发部署
- 可以在 Vercel 控制台查看部署状态
- 支持手动触发重新部署

---

## 📊 监控和日志

### 查看日志

在 Vercel 控制台中：
1. 点击你的项目
2. 选择 **Logs** 标签
3. 可以查看实时日志

### 监控

Vercel 提供以下监控指标：
- 响应时间
- 错误率
- 请求次数
- 带宽使用

---

## 🎯 完成清单

部署完成后，请确认以下事项：

- [ ] Vercel 项目状态为 **Ready**
- [ ] 健康检查接口返回正常
- [ ] 登录接口测试通过
- [ ] 前端已更新为新的后端域名
- [ ] 微信小程序域名已配置（如需要）
- [ ] 游戏功能测试正常
- [ ] 用户登录功能正常
- [ ] 排行榜功能正常
- [ ] 头像上传功能正常

---

## 📚 配置文件说明

### server/vercel.json

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/vercel.js"
    }
  ],
  "env": {
    "COZE_SUPABASE_URL": "@coze-supabase-url",
    "COZE_SUPABASE_ANON_KEY": "@coze-supabase-anon-key",
    "NODE_ENV": "production"
  }
}
```

**说明**：
- `buildCommand`: 构建命令
- `outputDirectory`: 输出目录
- `routes`: 路由配置，所有请求都转发到 `/vercel.js`
- `env`: 环境变量配置

### server/src/vercel.ts

这是 Vercel 的入口文件，用于适配 NestJS 到 Vercel 的 Serverless 环境。

---

## 🆘 获取帮助

如果遇到问题：

1. 查看 Vercel 官方文档：https://vercel.com/docs
2. 查看 NestJS Vercel 部署指南：https://docs.nestjs.com/faq/serverless
3. 检查 Vercel 部署日志
4. 查看本项目 GitHub Issues

---

## 🎉 总结

**部署完成后**：

1. 后端运行在 Vercel 上
2. 域名格式：`https://coze-mini-program-api-xxx.vercel.app`
3. 支持 Supabase 数据库
4. 支持所有用户 API
5. 前端可以正常调用后端接口

**祝你部署顺利！** 🚀
