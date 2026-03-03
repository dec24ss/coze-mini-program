# Render 部署指南

## 📋 前置要求

- GitHub 账号
- 已将代码推送到 GitHub 仓库：`dec24ss/coze-mini-program`

---

## 🚀 部署步骤

### 方式一：使用 render.yaml 自动配置（推荐）

#### 步骤 1：访问 Render

打开：https://render.com

#### 步骤 2：登录并授权

1. 点击 **Sign Up** 或 **Log In**
2. 使用 GitHub 账号登录
3. 授权 Render 访问你的 GitHub 仓库

#### 步骤 3：创建新服务

1. 点击右上角的 **New** → **New Blueprint**
2. 点击 **Connect GitHub repository**
3. 选择 `dec24ss/coze-mini-program` 仓库
4. 点击 **Connect**

#### 步骤 4：配置部署

Render 会自动读取 `render.yaml` 配置文件，点击 **Apply** 即可开始部署。

#### 步骤 5：等待部署

部署需要 3-5 分钟，期间会自动：
- 安装依赖
- 构建项目
- 启动服务
- 配置环境变量

---

### 方式二：手动配置 Web Service

如果自动配置失败，可以手动配置：

#### 步骤 1：创建 Web Service

1. 点击 **New** → **Web Service**
2. 点击 **Connect GitHub repository**
3. 选择 `dec24ss/coze-mini-program` 仓库
4. 点击 **Connect**

#### 步骤 2：配置服务

**Name（服务名称）**
```
coze-mini-program-api
```

**Root Directory（根目录）** 🔴 重要
```
server
```

**Runtime（运行时）**
```
Node
```

**Build Command（构建命令）**
```
npm run build
```

**Start Command（启动命令）**
```
npm run start:prod
```

#### 步骤 3：配置环境变量

在 **Environment Variables** 部分添加以下环境变量：

| Key | Value |
|-----|-------|
| `COZE_SUPABASE_URL` | `https://egutrdawrbziyklwnuov.supabase.co` |
| `COZE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVndXRyZGF3cmJ6aXlrbHdudW92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0MjUwMTEsImV4cCI6MjA4ODAwMTAxMX0.PKGOVO2ItYvesw714VRdGxuTjGgNw5WU2LHTDLObQfs` |
| `NODE_ENV` | `production` |

#### 步骤 4：配置健康检查（可选）

**Health Check Path**
```
/api/health
```

#### 步骤 5：部署

点击 **Create Web Service** 开始部署。

---

## 🧪 验证部署

部署成功后，你会获得一个域名，格式类似：

```
https://coze-mini-program-api-xxx.onrender.com
```

### 测试 API 接口

```bash
# 测试健康检查
curl https://your-render-domain.onrender.com/api/health

# 测试登录接口
curl -X POST https://your-render-domain.onrender.com/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"openid":"test_render","nickname":"Render测试"}'
```

预期响应：
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "userId": "xxx",
    "openid": "test_render",
    "nickname": "Render测试"
  }
}
```

---

## 🔧 更新前端配置

部署成功后，需要更新前端配置以使用新的后端域名。

### 修改 `src/stores/userStore.ts`

```typescript
// 找到这一行：
const BASE_URL = isWeapp 
  ? 'http://localhost:3000' 
  : '';

// 替换为你的 Render 域名：
const BASE_URL = isWeapp 
  ? 'https://coze-mini-program-api-xxx.onrender.com' 
  : '';
```

### 修改 `src/components/user-profile-modal/index.tsx`

```typescript
// 找到这一行：
const UPLOAD_URL = isWeapp
  ? 'http://localhost:3000/api/users/upload-avatar'
  : '/api/users/upload-avatar';

// 替换为你的 Render 域名：
const UPLOAD_URL = isWeapp
  ? 'https://coze-mini-program-api-xxx.onrender.com/api/users/upload-avatar'
  : '/api/users/upload-avatar';
```

### 修改所有其他网络请求

检查以下文件，确保所有网络请求都更新了域名：

- `src/stores/userStore.ts`
- `src/components/user-profile-modal/index.tsx`
- 其他调用后端 API 的文件

**批量替换方法：**
使用 VS Code 的全局查找替换功能：
- 查找：`'http://localhost:3000`
- 替换为：`'https://your-render-domain.onrender.com`

---

## 📱 配置微信小程序域名

如果要在微信小程序中使用，需要将 Render 域名添加到微信小程序合法域名白名单。

### 步骤

1. 登录微信公众平台：https://mp.weixin.qq.com
2. 进入 **开发** → **开发管理** → **开发设置**
3. 找到 **服务器域名**
4. 在 **request 合法域名** 中添加：
   ```
   https://your-render-domain.onrender.com
   ```
5. 保存并等待生效（约 10 分钟）

---

## ⚠️ 常见问题

### 问题 1：部署失败 - Build Error

**原因**：依赖安装失败

**解决方案**：
- 检查 `server/package.json` 是否正确
- 确保所有依赖都正确列出
- 查看 Render 的构建日志

### 问题 2：服务启动失败 - Cannot start

**原因**：`startCommand` 配置错误

**解决方案**：
- 确认使用 `npm run start:prod`
- 检查 `server/package.json` 中的 scripts 配置

### 问题 3：健康检查失败

**原因**：健康检查路径错误

**解决方案**：
- 确保路径为 `/api/health`
- 检查 `server/src/app.controller.ts` 中是否实现了该接口

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

---

## 🔄 自动部署

Render 支持自动部署，配置完成后：

- 每次推送到 `main` 分支会自动触发部署
- 可以在 Render 控制台查看部署状态
- 支持手动触发重新部署

---

## 📊 监控和日志

### 查看日志

在 Render 控制台中：
1. 点击你的服务
2. 选择 **Logs** 标签
3. 可以查看实时日志

### 监控

Render 提供以下监控指标：
- CPU 使用率
- 内存使用率
- 网络流量
- 响应时间

---

## 🎯 完成清单

部署完成后，请确认以下事项：

- [ ] Render 服务状态为 **Live**
- [ ] 健康检查接口返回正常
- [ ] 登录接口测试通过
- [ ] 其他 API 接口测试通过
- [ ] 前端已更新为新的后端域名
- [ ] 微信小程序域名已配置（如需要）
- [ ] 游戏功能测试正常
- [ ] 用户登录功能正常
- [ ] 排行榜功能正常

---

## 🆘 获取帮助

如果遇到问题：

1. 查看 Render 官方文档：https://render.com/docs
2. 检查 Render 服务日志
3. 查看本项目 GitHub Issues

---

**祝你部署顺利！** 🚀
