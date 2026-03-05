# 云开发迁移指南

## 📋 迁移概览

将项目从 NestJS 后端 + Supabase 数据库完整迁移到腾讯云云开发。

---

## 🎯 云开发优势

| 功能 | 原方案 | 云开发 |
|------|--------|--------|
| 后端服务 | NestJS 服务器 | 云函数 |
| 数据库 | Supabase | 云开发数据库 |
| 存储 | 对象存储 | 云开发存储 |
| 认证 | 微信登录 | 云开发认证 |
| 部署 | 手动部署 | 一键部署 |
| 运维 | 需维护服务器 | 腾讯云托管 |

---

## 🚀 快速开始

### 1. 开通云开发环境

1. 访问 [腾讯云云开发控制台](https://console.cloud.tencent.com/tcb)
2. 登录并选择环境：`cloudbase-8g1wqiy0823dea4a`
3. 确认环境已开通

### 2. 创建数据库集合

在云开发控制台 → 数据库 → 新建集合：

| 集合名 | 说明 | 权限设置 |
|--------|------|---------|
| `users` | 用户数据 | 所有用户可读，仅创建者可写 |

### 3. 配置安全规则

在云开发控制台 → 数据库 → 安全规则：

```json
{
  "read": "auth != null",
  "write": "auth != null && doc.openid == auth.openid"
}
```

---

## 📁 项目文件结构

```
src/
├── cloudbase/
│   └── index.ts          # 云开发初始化
├── stores/
│   ├── userStore.ts       # 原 Supabase 版本
│   └── userStore-cloudbase.ts  # 云开发版本
└── ...
```

---

## 🔧 核心配置

### 1. 云开发初始化

**文件**: `src/cloudbase/index.ts`

```typescript
import cloud from '@cloudbase/js-sdk'

const CLOUDBASE_ENV = 'cloudbase-8g1wqiy0823dea4a'

export function initCloudbase() {
  const app = cloud.init({
    env: CLOUDBASE_ENV
  })
  return app
}
```

### 2. 用户 Store（云开发版本）

**文件**: `src/stores/userStore-cloudbase.ts`

包含所有用户操作：
- 登录/注册
- 获取/更新用户信息
- 排行榜查询
- 积分管理
- 关卡更新

---

## 📊 数据库结构

### users 集合

```json
{
  "_id": "自动生成",
  "openid": "用户唯一标识",
  "nickname": "用户昵称",
  "avatarUrl": "头像URL",
  "highestLevel": 最高关卡,
  "points": 积分,
  "createdAt": "创建时间",
  "updatedAt": "更新时间"
}
```

---

## 🔄 迁移步骤

### 阶段1：准备阶段

- [ ] 确认云开发环境已开通
- [ ] 创建数据库集合
- [ ] 配置安全规则
- [ ] 安装云开发 SDK（已完成）

### 阶段2：代码迁移

- [ ] 初始化云开发（已完成）
- [ ] 创建云开发用户 Store（已完成）
- [ ] 修改页面使用云开发 Store
- [ ] 测试登录功能
- [ ] 测试排行榜功能
- [ ] 测试游戏功能

### 阶段3：部署上线

- [ ] 在小程序后台配置云开发
- [ ] 上传云函数（如需）
- [ ] 测试完整流程
- [ ] 发布上线

---

## 🎨 前端页面修改

### 修改入口文件

**文件**: `src/app.tsx`

```typescript
import { initCloudbase } from '@/cloudbase'

// 在应用启动时初始化云开发
useEffect(() => {
  initCloudbase()
}, [])
```

### 修改使用 Store 的页面

**文件**: `src/pages/index/index.tsx`

```typescript
// ❌ 原方案
import { useUserStore } from '@/stores/userStore'

// ✅ 云开发方案
import { useUserStoreCloudbase } from '@/stores/userStore-cloudbase'

const { userInfo, isLoggedIn, login } = useUserStoreCloudbase()
```

---

## ⚠️ 注意事项

### 1. 环境配置

确保在项目中配置正确的环境 ID：
```typescript
const CLOUDBASE_ENV = 'cloudbase-8g1wqiy0823dea4a'
```

### 2. 安全规则

- 数据库安全规则需要正确配置
- 云函数权限需要正确设置
- 存储权限需要合理配置

### 3. 数据迁移

如果需要迁移现有数据：
1. 从 Supabase 导出数据
2. 批量导入到云开发数据库
3. 验证数据完整性

---

## 🔮 后续优化

### 1. 使用云函数

将复杂逻辑放到云函数中：
- 头像上传处理
- 排行榜计算
- 积分管理

### 2. 使用云存储

- 图片上传到云存储
- 生成临时访问链接
- 自动缩略图生成

### 3. 使用实时数据库

- 实时排行榜更新
- 实时聊天功能
- 多人在线对战

---

## 📞 获取帮助

- [腾讯云云开发文档](https://cloud.tencent.com/document/product/876)
- [云开发社区](https://developers.weixin.qq.com/community/minihome)

---

## ✅ 检查清单

### 开发环境
- [ ] 云开发 SDK 已安装
- [ ] 云开发初始化代码已创建
- [ ] 用户 Store 已创建
- [ ] 页面修改完成
- [ ] 功能测试通过

### 生产环境
- [ ] 云开发环境已开通
- [ ] 数据库集合已创建
- [ ] 安全规则已配置
- [ ] 小程序后台配置完成
- [ ] 上线测试通过
