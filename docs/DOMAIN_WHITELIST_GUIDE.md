# 微信小程序域名白名单配置指南

## 问题描述

线上版小程序显示图片全部加载失败，开发版显示全部加载成功。

## 根本原因

**微信小程序有严格的网络域名白名单限制**，默认情况下不能访问外部图片 URL。

当前后端返回的图片 URL 包含以下域名：
- `https://picsum.photos/` - Lorem Picsum 图片服务

这些域名需要在微信小程序后台配置为合法域名才能访问。

## 解决方案

### 方案一：配置域名白名单（推荐）

#### 步骤 1：登录微信小程序后台

1. 访问 [微信公众平台](https://mp.weixin.qq.com/)
2. 登录你的小程序账号
3. 进入 "开发" -> "开发管理"

#### 步骤 2：配置服务器域名

1. 点击左侧菜单 "开发" -> "开发管理"
2. 点击 "开发设置"
3. 向下滚动到 "服务器域名" 部分
4. 点击 "修改"

#### 步骤 3：添加图片域名白名单

在 **request合法域名** 或 **uploadFile合法域名** 中添加：

```
https://picsum.photos
```

如果还有其他域名，也需要一并添加：
```
https://images.unsplash.com
```

#### 步骤 4：保存并重新发布

1. 点击 "保存"
2. 等待配置生效（通常需要几分钟）
3. 重新发布小程序
4. 用户更新小程序后，图片加载应该正常

### 方案二：修改后端使用本地图片（已实施）

为了解决域名白名单问题，我已经修改了后端代码：

#### 修改内容

1. **后端修改**（`server/src/image/image.service.ts`）：
   - `getRandomImages()` 方法现在优先返回本地图片
   - 如果本地图片不存在，降级使用预设图片列表
   - 避免返回外部 CDN URL

2. **前端修改**（`src/stores/gameStore.ts`）：
   - 增加所有图片加载失败的错误处理
   - 显示友好的错误提示
   - 提供重试功能

#### 优点
- ✅ 不需要配置域名白名单
- ✅ 图片加载更稳定
- ✅ 减少外部依赖

#### 缺点
- ❌ 需要后端预先下载图片到本地
- ❌ 图片内容固定，无法随机生成

### 方案三：使用后端代理（备选）

如果以上方案都不可行，可以考虑使用后端代理：

#### 实现方式

1. 创建一个后端接口，代理外部图片请求
2. 前端通过后端接口获取图片
3. 后端下载图片并返回给前端

#### 代码示例

```typescript
// 后端接口
@Get('proxy/:url')
@Header('Content-Type', 'image/jpeg')
async proxyImage(@Param('url') url: string) {
  // 解码 URL
  const decodedUrl = decodeURIComponent(url)

  // 下载图片
  const response = await axios.get(decodedUrl, {
    responseType: 'stream'
  })

  // 返回图片流
  return new StreamableFile(response.data)
}

// 前端调用
const imageUrl = `/api/images/proxy/${encodeURIComponent(externalUrl)}`
```

## 推荐方案

**推荐使用方案二（本地图片）**，原因：

1. ✅ 已实施，无需额外配置
2. ✅ 图片加载稳定，不受外部网络影响
3. ✅ 不需要配置域名白名单
4. ✅ 符合微信小程序最佳实践

## 验证方法

### 方法 1：使用开发工具页面

1. 长按首页标题 "海海拼图大作战" 进入开发工具
2. 查看环境信息和缓存信息
3. 检查图片加载日志

### 方法 2：查看控制台日志

1. 打开微信开发者工具
2. 查看控制台日志
3. 搜索 "图片加载" 或 "picsum"
4. 检查是否有错误信息

### 方法 3：测试图片加载

1. 清除所有缓存
2. 重新加载图片
3. 观察加载进度
4. 检查是否成功

## 常见问题

### Q1: 配置域名白名单后仍然无法加载图片？

**A**: 检查以下几点：
1. 确认域名配置正确（包含 `https://`）
2. 等待配置生效（通常需要几分钟）
3. 重新发布小程序
4. 用户更新小程序后重试

### Q2: 本地图片也不存在？

**A**: 检查后端图片目录：
```bash
# 查看图片目录
ls -la server/public/images/

# 如果目录为空，重启后端服务器会自动下载
pnpm dev:server
```

### Q3: 图片加载很慢？

**A**: 优化方案：
1. 使用更小的图片尺寸（已优化为 900x1200）
2. 降低图片质量（已优化为 75%）
3. 使用 CDN 加速（如果使用外部图片）

### Q4: 部署后图片仍然加载失败？

**A**: 排查步骤：
1. 检查后端日志，确认图片目录存在
2. 检查小程序域名白名单配置
3. 使用开发工具页面查看环境信息
4. 查看前端控制台日志
5. 检查网络连接

## 技术细节

### 微信小程序域名白名单限制

微信小程序对网络请求有严格的限制，必须配置合法域名才能访问：

- **request合法域名**：用于 `wx.request`、`wx.uploadFile`、`wx.downloadFile`
- **socket合法域名**：用于 `wx.connectSocket`、`wx.sendSocketMessage`、`wx.closeSocket`、`wx.onSocketOpen`、`wx.onSocketError`、`wx.onSocketMessage`、`wx.onSocketClose`
- **uploadFile合法域名**：用于 `wx.uploadFile`
- **downloadFile合法域名**：用于 `wx.downloadFile`
- **business合法域名**：用于支付接口等

### 为什么开发版可以访问？

开发版小程序不受域名白名单限制，可以访问任何域名。这是为了方便开发调试。

但发布后的版本必须遵守域名白名单规则，否则网络请求会失败。

### 域名白名单配置要求

1. **必须使用 HTTPS**
   - 不支持 HTTP
   - 必须使用有效证书

2. **域名必须是已备案的**
   - 中国大陆服务器必须备案
   - 海外服务器不需要备案

3. **配置后需要重新发布**
   - 域名配置不会立即生效
   - 需要重新发布小程序
   - 用户需要更新小程序

## 总结

1. ✅ **根本原因**：微信小程序域名白名单限制
2. ✅ **推荐方案**：使用本地图片（已实施）
3. ✅ **备选方案**：配置域名白名单
4. ✅ **验证方法**：使用开发工具页面或查看日志
5. ✅ **常见问题**：详见上方 FAQ

## 相关文档

- [微信小程序网络请求](https://developers.weixin.qq.com/miniprogram/dev/framework/network.html)
- [服务器域名配置](https://developers.weixin.qq.com/miniprogram/dev/framework/server-communication/domain.html)
- [图片加载优化](https://developers.weixin.qq.com/miniprogram/dev/component/image.html)

---

**最后更新**: 2025-01-15
**适用版本**: v1.0.0+
