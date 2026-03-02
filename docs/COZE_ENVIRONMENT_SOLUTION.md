# 扣子编程环境图片加载问题解决方案

## 问题描述

在扣子编程环境部署的小程序，显示"服务器域名已禁用"，无法配置域名白名单，导致图片加载失败。

## 根本原因

扣子编程托管了小程序，域名配置由扣子管理，用户无法直接在微信小程序后台配置域名白名单。

## 解决方案

### 方案概述

由于无法配置外部域名白名单，我们采用以下策略：

1. **后端本地化图片**：图片存储在后端服务器，通过 `/api/images/` 路径访问
2. **自动域名拼接**：Network 工具自动添加扣子编程域名前缀
3. **图片预下载**：确保后端图片目录有图片，避免加载失败

### 技术实现

#### 1. 后端本地图片

**文件**: `server/src/image/image.service.ts`

```typescript
getRandomImages(count: number = 100): string[] {
  try {
    // 1. 读取本地图片目录
    const files = fs.readdirSync(this.imagesDir)
    const imageFiles = files.filter(file => file.endsWith('.jpg'))

    if (imageFiles.length > 0) {
      // 2. 使用本地图片
      const shuffled = [...imageFiles].sort(() => Math.random() - 0.5)
      const selectedFiles = shuffled.slice(0, count)

      // 3. 生成图片路径（相对路径）
      const result: string[] = []
      for (let i = 0; i < count; i++) {
        const fileIndex = i % selectedFiles.length
        result.push(`${this.imagesUrlBase}/${selectedFiles[fileIndex]}`)
      }

      return result
    } else {
      // 4. 降级使用预设图片列表
      return PAINTING_URLS.slice(0, count)
    }
  } catch (error) {
    // 5. 降级使用预设图片列表
    return PAINTING_URLS.slice(0, count)
  }
}
```

#### 2. 后端静态文件服务

**文件**: `server/src/main.ts`

```typescript
// 提供静态文件服务（图片）
const publicPath = path.join(__dirname, '../public');
app.use('/api/images', express.static(publicPath + '/images'));
```

#### 3. 前端自动域名拼接

Network 工具会自动添加扣子编程域名前缀：

```javascript
// common.js 中的 Network 定义
const urlHandler = (url) =>
  url.startsWith("http://") || url.startsWith("https://")
    ? url
    : `https://01185e42-ad09-4831-ad84-d12791b413e9.dev.coze.site${url}`

// 后端返回: /api/images/painting_0.jpg
// 前端自动拼接: https://01185e42-ad09-4831-ad84-d12791b413e9.dev.coze.site/api/images/painting_0.jpg
```

## 部署步骤

### 步骤 1: 下载图片到后端服务器

```bash
# 运行图片下载脚本
pnpm download-images
```

这个脚本会：
- 自动创建 `server/public/images/` 目录
- 下载 100 张图片到该目录
- 显示下载进度和结果

### 步骤 2: 验证图片下载成功

```bash
# 查看图片目录
ls -la server/public/images/

# 确认有 100 张图片
ls server/public/images/ | wc -l
```

预期输出：
```
painting_0.jpg
painting_1.jpg
painting_2.jpg
...
painting_99.jpg
```

### 步骤 3: 启动后端服务

```bash
# 启动后端服务
pnpm dev:server
```

后端启动时会：
- 检查图片目录
- 如果图片不存在，自动下载（异步）
- 提供 `/api/images/` 静态文件服务

### 步骤 4: 测试图片接口

```bash
# 测试获取随机图片列表
curl http://localhost:3000/api/images/random

# 预期响应（包含 100 个图片路径）
{
  "code": 200,
  "msg": "success",
  "data": {
    "images": [
      "/api/images/painting_45.jpg",
      "/api/images/painting_12.jpg",
      ...
    ],
    "total": 100,
    "version": "20250115"
  }
}
```

### 步骤 5: 测试图片访问

```bash
# 测试访问单张图片
curl -I http://localhost:3000/api/images/painting_0.jpg

# 预期响应
HTTP/1.1 200 OK
Content-Type: image/jpeg
...
```

### 步骤 6: 部署到扣子编程

1. 确保图片已下载到 `server/public/images/` 目录
2. 提交代码到版本控制
3. 在扣子编程平台重新部署
4. 等待部署完成

### 步骤 7: 验证线上环境

1. 扫码进入小程序
2. 使用开发工具页面查看环境信息
3. 检查图片加载日志
4. 确认图片可以正常显示

## 常见问题

### Q1: 图片下载失败怎么办？

**A**: 检查以下几点：

1. 网络连接是否正常
2. `picsum.photos` 域名是否可以访问
3. 磁盘空间是否足够

**解决方案**:

```bash
# 重新运行下载脚本
pnpm download-images

# 或者手动下载图片到 server/public/images/ 目录
```

### Q2: 后端启动后图片仍然加载失败？

**A**: 检查以下几点：

1. 图片目录是否存在：`server/public/images/`
2. 图片文件是否存在：`ls server/public/images/`
3. 静态文件服务是否正确配置

**解决方案**:

```bash
# 检查图片目录
ls -la server/public/images/

# 重启后端服务
pnpm dev:server

# 查看后端日志，确认图片服务启动成功
```

### Q3: 线上环境图片仍然加载失败？

**A**: 排查步骤：

1. 使用开发工具页面查看环境信息
2. 检查 Network 的域名前缀是否正确
3. 查看控制台日志，确认图片请求 URL
4. 检查后端是否正确部署

**解决方案**:

```bash
# 1. 检查开发工具页面
# 长按首页标题进入开发工具
# 查看环境信息和 API 地址

# 2. 查看控制台日志
# 搜索 "图片加载" 或 "api/images"
# 确认图片请求 URL 是否正确

# 3. 重新部署
# 确保代码已提交
# 在扣子编程平台重新部署
```

### Q4: 想要添加更多图片怎么办？

**A**: 方法如下：

1. 下载新图片到 `server/public/images/` 目录
2. 修改 `PAINTING_URLS` 数组（如果使用预设列表）
3. 重启后端服务
4. 重新部署

**示例**:

```bash
# 下载新图片
wget -O server/public/images/custom_0.jpg https://example.com/image.jpg

# 重启后端
pnpm dev:server
```

### Q5: 图片访问速度慢怎么办？

**A**: 优化方案：

1. 使用 CDN 加速（需要配置对象存储）
2. 减小图片尺寸（已优化为 900x1200）
3. 降低图片质量（已优化为 75%）
4. 使用 WebP 格式（更好的压缩率）

## 扣子编程环境特殊说明

### 域名管理

扣子编程托管了小程序的域名配置，你无法直接在微信小程序后台配置域名白名单。

### 自动域名拼接

Network 工具会自动添加扣子编程的域名前缀：

```javascript
// 扣子编程域名
const COZE_DOMAIN = 'https://01185e42-ad09-4831-ad84-d12791b413e9.dev.coze.site'

// 后端返回路径
const backendPath = '/api/images/painting_0.jpg'

// Network 自动拼接
const finalUrl = COZE_DOMAIN + backendPath
// 结果: https://01185e42-ad09-4831-ad84-d12791b413e9.dev.coze.site/api/images/painting_0.jpg
```

### 静态文件服务

后端提供的静态文件服务（`/api/images/`）会自动映射到扣子编程的域名，无需额外配置。

### 限制说明

1. **不能配置外部域名白名单**：扣子编程管理域名配置
2. **必须使用相对路径**：后端返回 `/api/images/` 而不是完整的 URL
3. **图片必须存储在后端**：不能使用外部 CDN（除非扣子支持）

## 验证清单

部署前请确认以下事项：

- [ ] 图片已下载到 `server/public/images/` 目录
- [ ] 图片数量 >= 100
- [ ] 后端静态文件服务配置正确
- [ ] 图片接口返回相对路径（`/api/images/`）
- [ ] Network 自动添加域名前缀
- [ ] 本地测试图片可以正常加载
- [ ] 代码已提交到版本控制
- [ ] 在扣子编程平台重新部署

## 技术支持

如果遇到问题，请提供以下信息：

1. 开发工具页面的环境信息
2. 控制台日志（搜索 "图片加载"）
3. 后端日志（图片服务启动状态）
4. 图片接口响应（`/api/images/random`）
5. 图片访问响应（`/api/images/painting_0.jpg`）

## 总结

1. ✅ **无法配置域名白名单**：扣子编程管理域名配置
2. ✅ **解决方案**：使用后端本地图片 + 自动域名拼接
3. ✅ **图片路径**：`/api/images/painting_0.jpg`
4. ✅ **最终 URL**：`https://01185e42-ad09-4831-ad84-d12791b413e9.dev.coze.site/api/images/painting_0.jpg`
5. ✅ **部署步骤**：下载图片 → 启动后端 → 验证接口 → 部署到扣子编程

## 相关文档

- [域名白名单配置指南](./DOMAIN_WHITELIST_GUIDE.md)
- [测试指南](./TESTING_GUIDE.md)

---

**最后更新**: 2025-01-15
**适用版本**: v1.0.0+
