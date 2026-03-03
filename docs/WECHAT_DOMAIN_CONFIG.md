# 微信小程序域名白名单配置指南

## 📋 概述

微信小程序线上版（正式版）必须在微信公众平台配置域名白名单，才能正常访问外部资源。开发版可以在微信开发者工具中勾选"不校验合法域名"来绕过此限制，但正式版必须严格配置。

---

## 🔧 需要配置的域名

### 1. request 合法域名（API请求）

**用途**：后端API请求

**需要添加的域名**：
- 你的后端服务器域名（例如：`https://your-server.com`）
- Supabase API域名：`https://egutrdawrbziyklwnuov.supabase.co`

**配置步骤**：
1. 登录微信公众平台：https://mp.weixin.qq.com
2. 进入「开发」→「开发管理」→「开发设置」→「服务器域名」
3. 点击「request合法域名」的「修改」按钮
4. 添加以下域名：
   ```
   https://your-server.com
   https://egutrdawrbziyklwnuov.supabase.co
   ```

### 2. uploadFile 合法域名（文件上传）

**用途**：头像上传等文件上传功能

**需要添加的域名**：
- 你的后端服务器域名（例如：`https://your-server.com`）
- Supabase API域名：`https://egutrdawrbziyklwnuov.supabase.co`

**配置步骤**：
1. 在「服务器域名」中找到「uploadFile合法域名」
2. 添加以下域名：
   ```
   https://your-server.com
   https://egutrdawrbziyklwnuov.supabase.co
   ```

### 3. downloadFile 合法域名（文件下载）

**用途**：加载图片资源

**需要添加的域名**：
- 维基百科图片：`https://upload.wikimedia.org`
- DiceBear默认头像：`https://api.dicebear.com`
- 对象存储域名（如配置了）：`https://your-bucket.s3.region.amazonaws.com`

**配置步骤**：
1. 在「服务器域名」中找到「downloadFile合法域名」
2. 添加以下域名：
   ```
   https://upload.wikimedia.org
   https://api.dicebear.com
   ```

---

## 📝 完整配置清单

### request 合法域名
```
https://your-server.com
https://egutrdawrbziyklwnuov.supabase.co
```

### uploadFile 合法域名
```
https://your-server.com
https://egutrdawrbziyklwnuov.supabase.co
```

### downloadFile 合法域名
```
https://upload.wikimedia.org
https://api.dicebear.com
```

**注意**：请将 `https://your-server.com` 替换为你实际的后端服务器域名。

---

## 🚀 配置后的操作步骤

### 1. 重新构建前端

配置好域名白名单后，需要重新构建前端：

```bash
# 设置环境变量（重要！）
export PROJECT_DOMAIN=https://your-server.com

# 或者创建 .env.local 文件
echo "PROJECT_DOMAIN=https://your-server.com" > .env.local

# 重新构建
pnpm build:weapp
```

### 2. 上传小程序

1. 打开微信开发者工具
2. 导入项目：选择 `dist` 目录
3. 确认 AppID 正确
4. 点击「上传」按钮
5. 填写版本号和项目备注
6. 提交审核

### 3. 测试验证

在微信开发者工具中：
1. 取消勾选「不校验合法域名」选项
2. 预览小程序
3. 测试图片加载和数据库访问
4. 确认所有功能正常

---

## ❓ 常见问题

### Q1: 为什么开发版正常，线上版失败？

**A**: 微信小程序的安全策略：
- **开发版**：可以在开发者工具中勾选"不校验合法域名"
- **体验版**：同样需要配置域名白名单
- **正式版**：必须严格配置，无法绕过

### Q2: 域名白名单有数量限制吗？

**A**: 有，每个类型的域名最多配置20个。本项目需要配置的域名数量在限制范围内。

### Q3: 可以使用HTTP吗？

**A**: 不可以。微信小程序只支持HTTPS协议，所有域名必须使用HTTPS。

### Q4: 配置后多久生效？

**A**: 域名白名单配置立即生效，但需要重新上传小程序代码才能使用新配置。

### Q5: 如何测试域名配置是否正确？

**A**: 
1. 在微信开发者工具中取消勾选"不校验合法域名"
2. 预览小程序
3. 检查控制台是否有域名相关错误
4. 测试所有网络请求功能

---

## 🔍 验证清单

配置完成后，请逐项检查：

- [ ] request 合法域名已添加后端API域名
- [ ] request 合法域名已添加Supabase域名
- [ ] uploadFile 合法域名已添加后端API域名
- [ ] uploadFile 合法域名已添加Supabase域名
- [ ] downloadFile 合法域名已添加维基百科图片域名
- [ ] downloadFile 合法域名已添加DiceBear域名
- [ ] .env.local 文件已创建并配置 PROJECT_DOMAIN
- [ ] 前端已重新构建
- [ ] 小程序已重新上传
- [ ] 在开发者工具中测试（取消"不校验合法域名"）
- [ ] 真机预览测试通过

---

## 📞 技术支持

- 微信公众平台：https://mp.weixin.qq.com
- 微信小程序开发文档：https://developers.weixin.qq.com/miniprogram/dev/framework/ability/network.html

---

**最后更新**: 2026-03-02
