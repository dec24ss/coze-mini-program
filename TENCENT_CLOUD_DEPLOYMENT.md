# 腾讯云开发环境部署指南

本指南介绍如何将拼图小游戏部署到腾讯云开发环境（TCB）。

---

## 📋 前置要求

- 微信开发者工具
- 腾讯云开发账号
- 已注册微信小程序

---

## 🚀 部署步骤

### 步骤 1：创建腾讯云开发环境

#### 1.1 登录腾讯云开发控制台

打开：https://console.cloud.tencent.com/tcb

#### 1.2 创建新环境

1. 点击 **新建环境**
2. 选择 **微信小程序**
3. 输入环境名称，例如：`puzzle-game`
4. 选择环境规格（推荐：按量计费）
5. 点击 **下一步** → **创建**

#### 1.3 获取环境 ID

创建成功后，在环境列表中可以看到 **环境 ID**，格式类似：
```
puzzle-game-xxxxxxxx
```

**请记住这个环境 ID**，后续配置需要用到。

---

### 步骤 2：配置云开发环境

#### 2.1 在小程序中关联云开发

1. 打开微信开发者工具
2. 进入你的小程序项目
3. 点击 **工具** → **构建工具**
4. 找到 **云开发**，点击 **开通**
5. 选择步骤 1 创建的环境

#### 2.2 修改项目配置

修改 `src/app.ts` 中的环境 ID：

```typescript
// 初始化腾讯云开发环境
if (Taro.getEnv() === Taro.ENV_TYPE.WEAPP) {
  try {
    Taro.cloud.init({
      env: 'puzzle-game-xxxxxxxx',  // 🔴 替换为你的环境 ID
      traceUser: true
    })
    console.log('腾讯云开发环境初始化成功')
  } catch (error) {
    console.error('腾讯云开发环境初始化失败:', error)
  }
}
```

---

### 步骤 3：创建云函数

#### 3.1 上传云函数

1. 打开微信开发者工具
2. 在项目根目录右键
3. 选择 **新建 Node.js 云函数**
4. 输入函数名称：`login`
5. 将 `cloudfunctions/login/index.js` 的内容复制到新建的云函数中
6. 右键点击云函数文件夹，选择 **上传并部署：云端安装依赖**

#### 3.2 重复创建其他云函数

按照相同步骤创建以下云函数：

| 云函数名称 | 用途 |
|-----------|------|
| `login` | 用户登录 |
| `updateUserInfo` | 更新用户信息 |
| `updateHighestLevel` | 更新最高关卡 |
| `getRankList` | 获取排行榜 |
| `addPoints` | 添加积分 |
| `consumePoints` | 消耗积分 |

---

### 步骤 4：配置数据库

#### 4.1 创建数据库集合

1. 打开腾讯云开发控制台
2. 进入 **数据库** 标签
3. 点击 **新建集合**
4. 输入集合名称：`users`
5. 权限设置：**所有用户可读写**（测试环境）
6. 点击 **确定**

#### 4.2 配置数据库索引（可选）

为了提高查询性能，可以在 `users` 集合上添加索引：

| 索引名称 | 字段 | 索引类型 |
|---------|------|---------|
| `openid_index` | `openid` | 唯一 |
| `highest_level_index` | `highest_level` | 降序 |
| `points_index` | `points` | 降序 |

---

### 步骤 5：配置云存储

#### 5.1 创建存储目录

1. 打开腾讯云开发控制台
2. 进入 **存储** 标签
3. 点击 **新建文件夹**
4. 输入文件夹名称：`avatars`
5. 点击 **确定**

#### 5.2 配置存储权限

1. 点击 **存储设置**
2. 权限设置：**所有用户可读写**（测试环境）
3. 点击 **保存**

---

### 步骤 6：更新 cloudbaserc.json 配置

修改项目根目录的 `cloudbaserc.json` 文件：

```json
{
  "envId": "puzzle-game-xxxxxxxx",  // 🔴 替换为你的环境 ID
  "$schema": "https://framework-1258016615.tcloudbaseapp.com/schema/latest.json",
  "version": "2.0",
  ...
}
```

---

### 步骤 7：编译和部署

#### 7.1 编译小程序

```bash
pnpm build:weapp
```

#### 7.2 上传小程序

1. 打开微信开发者工具
2. 点击 **上传** 按钮
3. 填写版本号和项目备注
4. 点击 **上传**

#### 7.3 提交审核

1. 登录微信公众平台
2. 进入 **版本管理**
3. 找到刚上传的版本
4. 点击 **提交审核**
5. 填写审核信息
6. 等待审核通过

---

## 🧪 测试部署

### 测试云函数

#### 1. 测试登录函数

在微信开发者工具中：

```javascript
wx.cloud.callFunction({
  name: 'login',
  data: {
    openid: 'test_openid',
    nickname: '测试用户',
    avatar_url: ''
  }
}).then(res => {
  console.log('登录成功:', res.result)
}).catch(err => {
  console.error('登录失败:', err)
})
```

#### 2. 测试排行榜函数

```javascript
wx.cloud.callFunction({
  name: 'getRankList',
  data: {
    limit: 10
  }
}).then(res => {
  console.log('排行榜数据:', res.result)
}).catch(err => {
  console.error('获取排行榜失败:', err)
})
```

---

## ⚠️ 常见问题

### 问题 1：云函数调用失败

**原因**：云函数未正确上传或部署

**解决方案**：
1. 检查云函数是否已上传到云端
2. 检查云函数代码是否正确
3. 查看云函数日志，定位错误

### 问题 2：数据库操作失败

**原因**：数据库权限配置错误

**解决方案**：
1. 检查数据库集合是否已创建
2. 检查数据库权限设置
3. 确认云函数中数据库操作代码正确

### 问题 3：云存储上传失败

**原因**：云存储权限配置错误

**解决方案**：
1. 检查云存储是否已开通
2. 检查云存储权限设置
3. 确认上传的文件路径正确

### 问题 4：环境 ID 配置错误

**原因**：`cloudbaserc.json` 或 `src/app.ts` 中的环境 ID 不正确

**解决方案**：
1. 从腾讯云开发控制台获取正确的环境 ID
2. 更新 `cloudbaserc.json` 和 `src/app.ts` 中的环境 ID
3. 重新编译和部署

---

## 📊 云函数说明

### login

**功能**：用户登录，返回用户信息

**参数**：
- `openid`：用户唯一标识
- `nickname`：用户昵称
- `avatar_url`：用户头像 URL

**返回**：
- `code`：状态码（200 成功）
- `msg`：消息
- `data`：用户信息

---

### updateUserInfo

**功能**：更新用户信息

**参数**：
- `openid`：用户唯一标识
- `nickname`：用户昵称（可选）
- `avatar_url`：用户头像 URL（可选）

**返回**：
- `code`：状态码（200 成功）
- `msg`：消息
- `data`：更新结果

---

### updateHighestLevel

**功能**：更新用户最高关卡

**参数**：
- `openid`：用户唯一标识
- `highest_level`：最高关卡

**返回**：
- `code`：状态码（200 成功）
- `msg`：消息
- `data`：更新结果

---

### getRankList

**功能**：获取排行榜

**参数**：
- `limit`：返回数量（默认 100）

**返回**：
- `code`：状态码（200 成功）
- `msg`：消息
- `data`：排行榜数据（包含排名）

---

### addPoints

**功能**：添加用户积分

**参数**：
- `openid`：用户唯一标识
- `points`：添加的积分

**返回**：
- `code`：状态码（200 成功）
- `msg`：消息
- `data`：积分更新结果

---

### consumePoints

**功能**：消耗用户积分

**参数**：
- `openid`：用户唯一标识
- `points`：消耗的积分

**返回**：
- `code`：状态码（200 成功）
- `msg`：消息
- `data`：积分更新结果

---

## 🎯 完成清单

部署完成后，请确认以下事项：

- [ ] 腾讯云开发环境已创建
- [ ] 环境 ID 已配置到 `cloudbaserc.json` 和 `src/app.ts`
- [ ] 所有云函数已上传并部署
- [ ] 数据库集合 `users` 已创建
- [ ] 云存储目录 `avatars` 已创建
- [ ] 小程序已成功编译和上传
- [ ] 云函数调用测试通过
- [ ] 数据库操作测试通过
- [ ] 云存储上传测试通过
- [ ] 游戏功能测试正常

---

## 📚 相关文档

- [腾讯云开发官方文档](https://docs.cloudbase.net/)
- [微信小程序云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
- [云函数开发文档](https://docs.cloudbase.net/cloud-function/introduction)
- [数据库开发文档](https://docs.cloudbase.net/database/introduction)
- [存储开发文档](https://docs.cloudbase.net/storage/introduction)

---

## 🆘 获取帮助

如果遇到问题：

1. 查看腾讯云开发官方文档
2. 查看微信小程序云开发文档
3. 查看云函数日志
4. 查看数据库日志
5. 联系腾讯云技术支持

---

## 🎉 总结

**部署完成后**：

1. 后端运行在腾讯云函数上
2. 数据存储在腾讯云数据库中
3. 文件存储在腾讯云存储中
4. 小程序可以直接调用云函数
5. 无需自己维护服务器

**祝你部署顺利！** 🚀
