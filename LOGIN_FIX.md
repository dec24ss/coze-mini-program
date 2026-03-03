# 微信登录问题修复说明

## 问题描述
微信登录失败，错误信息："登录失败：服务器返回数据格式错误"

## 问题原因分析

### 1. 小程序环境下的网络请求问题
在小程序环境中，`PROJECT_DOMAIN` 环境变量可能没有正确设置，导致 `Network.request()` 无法正确构建完整的 URL。

### 2. 请求 URL 格式错误
- **H5 环境**：使用 `/api/xxx` 相对路径，通过 Vite proxy 代理到 `http://localhost:3000`
- **小程序环境**：如果 `PROJECT_DOMAIN` 未设置，请求 URL 会变成 `/api/xxx`，小程序无法正确解析

### 3. 错误处理不足
原来的代码只检查 `response.data?.data`，没有检查：
- HTTP 状态码
- 业务状态码 (`response.data.code`)
- 响应数据的完整性

## 解决方案

### 1. 添加平台检测，使用不同的 URL

**修改文件**：
- `src/stores/userStore.ts`
- `src/components/user-profile-modal/index.tsx`

**修改内容**：
```typescript
// 检测平台
const isWeapp = Taro.getEnv() === Taro.ENV_TYPE.WEAPP

// 小程序环境使用完整 URL
const loginUrl = isWeapp
  ? 'http://localhost:3000/api/users/login'
  : '/api/users/login'

// 发送请求
const response = await Network.request({
  url: loginUrl,
  method: 'POST',
  data: { ... }
})
```

### 2. 增强错误处理和日志输出

**修改文件**：
- `src/stores/userStore.ts`

**修改内容**：
```typescript
// 检查 HTTP 状态码
if (response.statusCode !== 200) {
  console.error('HTTP 状态码错误:', response.statusCode)
  throw new Error(`服务器返回错误: HTTP ${response.statusCode}`)
}

// 检查响应数据格式
if (!response.data) {
  console.error('响应数据为空')
  throw new Error('登录失败：服务器未返回数据')
}

// 检查业务状态码
if (response.data.code !== 200) {
  console.error('业务状态码错误:', response.data.code, response.data.msg)
  throw new Error(`登录失败: ${response.data.msg || '未知错误'}`)
}

// 检查数据字段
if (!response.data.data) {
  console.error('响应数据中缺少 data 字段')
  console.error('完整响应:', JSON.stringify(response.data))
  throw new Error('登录失败：服务器返回数据格式错误')
}
```

### 3. 更新所有网络请求

**修改的文件和接口**：

| 文件 | 接口 | 修改内容 |
|------|------|----------|
| `src/stores/userStore.ts` | 登录接口 | 添加平台检测 + 增强错误处理 |
| `src/stores/userStore.ts` | 更新用户信息 | 添加平台检测 |
| `src/stores/userStore.ts` | 更新最高关卡 | 添加平台检测 |
| `src/stores/userStore.ts` | 添加积分 | 添加平台检测 |
| `src/stores/userStore.ts` | 使用积分 | 添加平台检测 |
| `src/stores/userStore.ts` | 获取排行榜 | 添加平台检测 |
| `src/components/user-profile-modal/index.tsx` | 上传头像 | 添加平台检测 |

## 验证步骤

### 1. 后端接口测试（已完成）
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"openid":"test_openid_123","nickname":"测试用户","avatar_url":""}'
```

**结果**：✅ 成功，返回正确格式的数据

### 2. 前端代码编译（已完成）
```bash
pnpm tsc --noEmit
```

**结果**：✅ 无编译错误

### 3. 小程序环境测试（待验证）

**测试步骤**：
1. 打开微信开发者工具
2. 点击"登录"按钮
3. 查看控制台日志

**预期结果**：
- 日志显示 `登录 API URL: http://localhost:3000/api/users/login`
- 后端响应正常
- 登录成功

## 注意事项

### 1. 生产环境配置

在生产环境中，需要配置正确的 `PROJECT_DOMAIN` 环境变量：

```bash
# .env.local
PROJECT_DOMAIN=https://your-domain.com
```

然后可以移除硬编码的 localhost URL：

```typescript
// 检测环境
const isProduction = process.env.NODE_ENV === 'production'
const loginUrl = isWeapp && !isProduction
  ? 'http://localhost:3000/api/users/login'  // 开发环境
  : (PROJECT_DOMAIN ? `${PROJECT_DOMAIN}/api/users/login` : '/api/users/login')
```

### 2. 微信小程序域名配置

在生产环境中，需要在微信小程序后台配置合法域名：

```
request合法域名：
- https://your-domain.com

uploadFile合法域名：
- https://your-domain.com
```

### 3. 错误日志

如果登录仍然失败，请查看以下日志：

**前端日志**：
- `登录参数`
- `微信登录成功，code: xxx`
- `登录 API URL: xxx`
- `后端响应`
- `响应状态码`
- `响应数据`

**后端日志**：
- 查看是否有 Supabase 相关错误
- 查看是否有网络请求错误

## 总结

通过以下修改解决了微信登录问题：
1. ✅ 添加平台检测，使用正确的 URL 格式
2. ✅ 增强错误处理，提供更详细的错误信息
3. ✅ 更新所有网络请求，确保一致性
4. ✅ 添加详细的日志输出，便于问题排查

修复后，小程序环境下的登录功能应该能正常工作。
