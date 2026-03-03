# 微信小程序域名白名单完整清单

## 📋 概述

本文档列出了拼图小程序需要配置的所有域名白名单，请按照以下清单在微信公众平台配置。

---

## 🔧 域名配置清单

### 一、request 合法域名

**用途**：API 请求（数据库访问、用户登录、排行榜等）

| 域名 | 用途 | 必需 |
|------|------|------|
| `https://your-server.com` | 你的后端API服务器 | ✅ 必需 |
| `https://egutrdawrbziyklwnuov.supabase.co` | Supabase 云数据库 | ✅ 必需 |

**注意**：请将 `https://your-server.com` 替换为你实际的后端服务器域名！

---

### 二、uploadFile 合法域名

**用途**：文件上传（头像上传等）

| 域名 | 用途 | 必需 |
|------|------|------|
| `https://your-server.com` | 你的后端API服务器 | ✅ 必需 |
| `https://egutrdawrbziyklwnuov.supabase.co` | Supabase 云数据库 | ✅ 必需 |

---

### 三、downloadFile 合法域名

**用途**：下载文件（图片、音效等）

| 域名 | 用途 | 必需 |
|------|------|------|
| `https://picsum.photos` | 拼图图片（随机高质量图片，共100张） | ✅ 必需 |
| `https://api.dicebear.com` | 用户默认头像生成 | ✅ 必需 |
| `https://images.unsplash.com` | 备用图片 | ⚠️ 建议 |
| `https://assets.mixkit.co` | 游戏音效文件 | ✅ 必需 |

---

## 📝 配置步骤

### 1. 登录微信公众平台

访问：https://mp.weixin.qq.com

### 2. 进入配置页面

路径：「开发」→「开发管理」→「开发设置」→「服务器域名」

### 3. 分别配置三类域名

#### request 合法域名
```
https://your-server.com
https://egutrdawrbziyklwnuov.supabase.co
```

#### uploadFile 合法域名
```
https://your-server.com
https://egutrdawrbziyklwnuov.supabase.co
```

#### downloadFile 合法域名
```
https://picsum.photos
https://api.dicebear.com
https://images.unsplash.com
https://assets.mixkit.co
```

---

## ✅ 配置验证清单

配置完成后，请逐项确认：

- [ ] request 域名已添加后端服务器域名
- [ ] request 域名已添加 Supabase 域名
- [ ] uploadFile 域名已添加后端服务器域名
- [ ] uploadFile 域名已添加 Supabase 域名
- [ ] downloadFile 域名已添加 Picsum 图片域名
- [ ] downloadFile 域名已添加 DiceBear 头像域名
- [ ] downloadFile 域名已添加 Unsplash 图片域名
- [ ] downloadFile 域名已添加 Mixkit 音效域名
- [ ] 所有域名均为 HTTPS 协议
- [ ] 已在开发者工具中取消勾选"不校验合法域名"进行测试

---

## ⚠️ 注意事项

1. **域名必须使用 HTTPS 协议**：HTTP 不被接受
2. **域名不能带端口号**：如 `https://example.com:3000` 是不允许的
3. **域名不能带路径**：如 `https://example.com/api` 是不允许的
4. **每个类型最多20个域名**：本项目配置数量在限制内
5. **配置立即生效**：但需要重新上传小程序代码

---

## 🔍 测试方法

配置完成后，在微信开发者工具中：

1. 取消勾选「不校验合法域名、web-view（业务域名）、TLS版本以及HTTPS证书」
2. 点击「预览」或「真机调试」
3. 测试以下功能：
   - [ ] 图片能否正常加载
   - [ ] 音效能否正常播放
   - [ ] 用户登录是否成功
   - [ ] 排行榜数据是否加载
   - [ ] 头像上传是否成功

---

**最后更新**: 2026-03-02
