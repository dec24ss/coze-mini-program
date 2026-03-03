# 部署检查清单

## ✅ 已自动完成的步骤

### 步骤 1：安装依赖（3 分钟）✅

**状态**：已完成
**包管理器**：pnpm 9.0.0
**Node 版本**：v24.13.1
**安装时间**：2.4 秒

**已安装的关键依赖**：
- Taro 框架 4.1.9
- React 18.0.0
- TypeScript 5.4.5
- TailwindCSS 4.1.18
- Zustand 5.0.9
- Lucide React Taro 1.2.0

---

### 步骤 2：编译小程序（2 分钟）✅

**状态**：已完成
**编译时间**：6.88 秒
**模块数**：176 个

**编译产物**（`dist/` 目录）：
- ✅ app.json - 应用配置（334 字节）
- ✅ app.js - 应用入口（1.2 KB）
- ✅ app.wxss - 应用样式（27 字节）
- ✅ common.js - 公共代码（25 KB）
- ✅ taro.js - Taro 框架（219 KB）
- ✅ vendors.js - 第三方库（651 KB）
- ✅ utils.wxs - 工具函数（997 字节）
- ✅ project.config.json - 小程序配置（611 字节）
- ✅ pages/ - 所有页面文件

**云函数代码**（`cloudfunctions/` 目录）：
- ✅ login/index.js（1.3 KB）- 用户登录
- ✅ updateUserInfo/index.js（1.1 KB）- 更新用户信息
- ✅ updateHighestLevel/index.js（982 字节）- 更新最高关卡
- ✅ getRankList/index.js（893 字节）- 获取排行榜
- ✅ addPoints/index.js（1.5 KB）- 添加积分
- ✅ consumePoints/index.js（1.8 KB）- 消耗积分

---

## 📋 需要手动执行的步骤

### 步骤 3：下载编译产物（2 分钟）⏳

**操作说明**：
1. 在扣子编程中，找到项目文件管理器
2. 选中 `dist` 目录
3. 右键选择"下载"或使用下载按钮
4. 保存到本地 `coze-mini-program` 目录

同时下载：
- ✅ `cloudfunctions` 目录（包含 6 个云函数）
- ✅ `project.config.json` 文件
- ✅ `cloudbaserc.json` 文件

**预计时间**：2 分钟

---

### 步骤 4：用微信开发者工具打开（2 分钟）⏳

**操作说明**：
1. 打开微信开发者工具
2. 点击"导入项目"
3. 选择本地 `coze-mini-program` 目录
4. 填写项目信息：
   - 项目名称：`拼图小游戏`
   - AppID：使用测试号（或你的小程序 AppID）
   - 开发模式：**小程序**
   - 后端服务：**不使用云服务**
5. 点击"导入"

**预计时间**：2 分钟

---

### 步骤 5：配置腾讯云开发（3 分钟）⏳

#### 5.1 关联云开发环境（1 分钟）

**操作说明**：
1. 在微信开发者工具中，点击顶部菜单"云开发"
2. 点击"开通"
3. 选择环境：`cloudbase-8g1wqiy0823dea4a`
4. 点击"确定"

#### 5.2 创建数据库集合（2 分钟）

**操作说明**：
1. 打开腾讯云控制台：https://console.cloud.tencent.com/tcb
2. 选择环境：`cloudbase-8g1wqiy0823dea4a`
3. 进入"数据库"
4. 点击"新建集合"
5. 集合名称：`users`
6. 权限设置：**所有用户可读写**
7. 点击"确定"

**数据库集合结构**：
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

**预计时间**：3 分钟

---

### 步骤 6：上传云函数（8 分钟）⏳

**操作说明**：

对于每个云函数（共 6 个）：

1. 在微信开发者工具中，右键 `cloudfunctions` 目录
2. 选择"新建 Node.js 云函数"
3. 输入云函数名称（如 `login`）
4. 点击确定
5. 打开新建的云函数目录：`cloudfunctions/login/index.js`
6. 从下载的 `cloudfunctions/login/index.js` 文件中复制代码
7. 粘贴到微信开发者工具的 `index.js` 中
8. 保存文件
9. 右键云函数文件夹
10. 选择"上传并部署：云端安装依赖"
11. 等待部署完成（约 1-2 分钟）

**需要上传的 6 个云函数**：
1. `login` - 用户登录
2. `updateUserInfo` - 更新用户信息
3. `updateHighestLevel` - 更新最高关卡
4. `getRankList` - 获取排行榜
5. `addPoints` - 添加积分
6. `consumePoints` - 消耗积分

**预计时间**：8 分钟

---

### 步骤 7：测试功能（2 分钟）⏳

**操作说明**：

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

**预计时间**：2 分钟

---

## 📊 部署进度

| 步骤 | 状态 | 时间 |
|------|------|------|
| 1. 安装依赖 | ✅ 已完成 | 3 分钟 |
| 2. 编译小程序 | ✅ 已完成 | 2 分钟 |
| 3. 下载编译产物 | ⏳ 需手动 | 2 分钟 |
| 4. 用微信开发者工具打开 | ⏳ 需手动 | 2 分钟 |
| 5. 配置腾讯云开发 | ⏳ 需手动 | 3 分钟 |
| 6. 上传云函数 | ⏳ 需手动 | 8 分钟 |
| 7. 测试功能 | ⏳ 需手动 | 2 分钟 |
| **总计** | **已完成 2/7** | **22 分钟** |

---

## 🎯 关键信息

**环境 ID**：`cloudbase-8g1wqiy0823dea4a`

**需要下载的文件/目录**：
- `dist/` 目录（小程序编译产物）
- `cloudfunctions/` 目录（6 个云函数）
- `project.config.json`（小程序配置）
- `cloudbaserc.json`（云开发配置）

**云函数列表**：
1. `login` - 用户登录
2. `updateUserInfo` - 更新用户信息
3. `updateHighestLevel` - 更新最高关卡
4. `getRankList` - 获取排行榜
5. `addPoints` - 添加积分
6. `consumePoints` - 消耗积分

**数据库集合**：
- `users` - 用户信息表

---

## 🆘 常见问题

### 问题 1：下载文件失败

**解决方案**：
- 检查网络连接
- 尝试分别下载 `dist` 和 `cloudfunctions` 目录
- 或使用打包工具：`tar -czf weapp-dist.tar.gz dist cloudfunctions`

### 问题 2：微信开发者工具打开失败

**解决方案**：
- 确认下载的文件完整
- 检查 `dist` 目录下是否有 `app.json` 文件
- 确认 AppID 配置正确

### 问题 3：云函数上传失败

**解决方案**：
- 检查云开发环境是否已关联
- 检查环境 ID 是否正确：`cloudbase-8g1wqiy0823dea4a`
- 查看云函数日志排查错误

### 问题 4：数据库操作失败

**解决方案**：
- 检查数据库集合 `users` 是否已创建
- 检查权限是否设置为"所有用户可读写"
- 查看云函数日志

---

## 📚 相关文档

- `COZE_QUICK_START.md` - 扣子编程快速部署指南
- `COZE_CLOUD_DEPLOYMENT.md` - 扣子编程详细部署指南
- `README.md` - 项目说明文档

---

## 🎉 下一步

按照上述步骤 3-7 依次执行，即可完成部署！

**预计剩余时间**：17 分钟

---

**祝你部署顺利！** 🚀✨
