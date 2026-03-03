# 扣子编程快速部署指南

本指南帮助你在 15 分钟内完成微信小程序的快速部署，使用扣子编程 + 腾讯云开发。

---

## 🎯 快速部署步骤

### 步骤 1：安装依赖（3 分钟）

在扣子编程终端中执行：

```bash
# 安装依赖
pnpm install

# 验证安装
pnpm --version
```

---

### 步骤 2：编译小程序（2 分钟）

```bash
# 编译小程序
pnpm build:weapp
```

**预期输出**：
```
✓ 176 modules transformed.
✓ built in 7.13s
```

---

### 步骤 3：下载编译产物（2 分钟）

在扣子编程中：

1. 找到 `dist` 目录
2. 右键选择下载
3. 保存到本地 `coze-mini-program` 目录

同时下载 `cloudfunctions` 目录。

---

### 步骤 4：用微信开发者工具打开（2 分钟）

1. 打开微信开发者工具
2. 导入项目
3. 选择本地 `coze-mini-program` 目录
4. 填写 AppID（使用测试号或你的 AppID）
5. 点击导入

---

### 步骤 5：配置腾讯云开发（3 分钟）

#### 5.1 关联云开发环境

1. 点击顶部菜单 "云开发"
2. 点击 "开通"
3. 选择环境：`cloudbase-8g1wqiy0823dea4a`
4. 点击 "确定"

#### 5.2 创建数据库集合

在腾讯云控制台：

1. 打开 https://console.cloud.tencent.com/tcb
2. 选择环境：`cloudbase-8g1wqiy0823dea4a`
3. 进入 **数据库**
4. 新建集合：`users`
5. 权限：所有用户可读写

---

### 步骤 6：上传云函数（8 分钟）

在微信开发者工具中：

1. 右键 `cloudfunctions` 目录
2. 新建 Node.js 云函数
3. 输入名称（如 `login`）
4. 从扣子编程复制代码到 `index.js`
5. 保存文件
6. 右键云函数文件夹
7. 选择 "上传并部署：云端安装依赖"

**上传 6 个云函数**：
- `login`
- `updateUserInfo`
- `updateHighestLevel`
- `getRankList`
- `addPoints`
- `consumePoints`

---

### 步骤 7：测试（2 分钟）

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
}).then(res => console.log('✅ 成功:', res.result))
```

---

## ✅ 检查清单

- [ ] 依赖已安装
- [ ] 小程序已编译（`dist` 目录存在）
- [ ] `dist` 和 `cloudfunctions` 已下载
- [ ] 微信开发者工具已打开项目
- [ ] 云开发环境已关联：`cloudbase-8g1wqiy0823dea4a`
- [ ] 数据库集合 `users` 已创建
- [ ] 6 个云函数已上传
- [ ] 测试通过

---

## 🔄 日常开发流程

### 1. 在扣子编程中修改代码

修改 `src/` 目录下的源代码

### 2. 重新编译

```bash
pnpm build:weapp
```

### 3. 下载更新

下载 `dist` 目录到本地

### 4. 刷新微信开发者工具

刷新或重新导入项目

### 5. 测试

在微信开发者工具中测试功能

---

## 🆘 常见问题

### 问题 1：编译失败

```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm build:weapp
```

### 问题 2：云函数调用失败

1. 检查云开发环境是否已关联
2. 检查云函数是否已上传
3. 检查环境 ID：`cloudbase-8g1wqiy0823dea4a`

### 问题 3：数据库操作失败


1. 检查数据库集合 `users` 是否已创建
2. 检查权限是否设置为"所有用户可读写"

---

## 📚 相关文档

- `COZE_CLOUD_DEPLOYMENT.md` - 详细部署指南
- `PROJECT_EXPORT_GUIDE.md` - 项目导出指南
- `QUICK_START.md` - 快速开始指南

---

## ⏱️ 预计时间

| 步骤 | 时间 |
|------|------|
| 安装依赖 | 3 分钟 |
| 编译小程序 | 2 分钟 |
| 下载编译产物 | 2 分钟 |
| 用微信开发者工具打开 | 2 分钟 |
| 配置腾讯云开发 | 3 分钟 |
| 上传云函数 | 8 分钟 |
| 测试 | 2 分钟 |
| **总计** | **22 分钟** |

---

## 🎉 完成

恭喜！你已经成功在扣子编程环境中部署了微信小程序！

**下一步**：
- 在扣子编程中继续开发
- 重新编译并下载更新
- 在微信开发者工具中测试

---

**祝你开发顺利！** 🚀
