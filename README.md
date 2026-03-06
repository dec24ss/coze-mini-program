# 🧩 海海拼图大作战 - 微信小程序

## 📦 项目说明

这是一个基于 Taro 框架开发的微信小程序拼图游戏，支持：
- 🎮 5种难度级别（3×3 到 7×7）
- 🏆 排行榜系统
- 🔓 关卡解锁机制
- 📱 适配手机的竖屏布局
- 🔊 震动反馈
- ☁️ 腾讯云开发（可选）

## 🚀 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 开发模式

```bash
# 启动开发环境（前端 + 后端）
pnpm dev

# 仅启动前端
pnpm dev:web

# 仅启动后端
pnpm dev:server
```

### 3. 构建生产版本

```bash
# 构建微信小程序
pnpm build:weapp

# 构建 H5 版本
pnpm build:web

# 构建后端
pnpm build:server
```

## 📁 项目结构

```
├── src/                    # 前端源代码
│   ├── pages/             # 页面
│   │   ├── loading/       # 加载页面
│   │   ├── index/         # 首页
│   │   ├── game/          # 游戏页面
│   │   ├── level-select/  # 关卡选择
│   │   └── rank/          # 排行榜
│   ├── stores/            # 状态管理（Zustand）
│   ├── components/        # 组件
│   ├── network/           # 网络请求封装
│   └── cloudbase/         # 云开发配置
├── server/                # 后端源代码（NestJS）
│   ├── src/
│   │   ├── image/        # 图片服务
│   │   ├── users/        # 用户服务
│   │   └── storage/      # 数据库
│   └── public/           # 静态资源
├── cloudfunctions/        # 云函数
│   ├── users/            # 用户管理
│   ├── rank/             # 排行榜
│   └── updateUser/       # 更新用户信息
├── public/               # 公共资源
├── config/               # 配置文件
└── types/                # 类型定义
```

## ☁️ 云开发配置

### 启用云开发

1. 打开 `src/cloudbase/index.ts`
2. 修改配置：

```typescript
export const USE_CLOUDBASE = true  // 改为 true
const CLOUDBASE_ENV = '你的云开发环境ID'  // 填入环境 ID
```

### 详细步骤

查看 **`ENABLE_CLOUDBASE.md`** 文件，包含：
- 开通云开发步骤
- 创建数据库集合
- 部署云函数
- 测试验证方法

## 📚 文档说明

- **README.md** - 项目说明（本文件）
- **ENABLE_CLOUDBASE.md** - 云开发启用完整指南
- **EXPORT_GUIDE.md** - 导出部署指南
- **CLOUDBASE_STATUS.md** - 云开发状态检查
- **design_guidelines.md** - 设计规范

## 🔧 技术栈

### 前端
- **Taro 4.1.9** - 多端统一框架
- **React 18** - UI 框架
- **TypeScript** - 类型安全
- **Tailwind CSS 4** - 样式方案
- **Zustand 5** - 状态管理

### 后端
- **NestJS** - Node.js 框架
- **Supabase** - 云数据库（可选）
- **腾讯云开发** - 云服务（可选）

### 云开发
- **@cloudbase/js-sdk** - 云开发 SDK
- **云函数** - 服务端逻辑
- **云数据库** - 数据存储

## 🎮 游戏功能

### 核心玩法
- 拖拽拼图碎片到正确位置
- 完成拼图进入下一关
- 难度递增（3×3 → 7×7）

### 特色功能
- ⏱️ 倒计时模式（有失败风险）
- 🎯 自由模式（无倒计时）
- 📊 排行榜系统
- 🏅 关卡解锁机制
- 🎨 随机图片（每次不同）

## 📱 支持平台

- ✅ 微信小程序
- ✅ H5
- ⚠️ 其他小程序平台（需适配）

## 🆘 常见问题

### Q: 图片加载失败？
A: 检查网络连接，等待图片下载完成。

### Q: 云开发不可用？
A: 确保已按照 `ENABLE_CLOUDBASE.md` 的步骤启用云开发。

### Q: 构建失败？
A: 
1. 删除 `node_modules` 和 `pnpm-lock.yaml`
2. 重新运行 `pnpm install`
3. 再次构建

### Q: 微信开发者工具预览白屏？
A: 
1. 检查控制台错误日志
2. 确保构建成功
3. 尝试清除缓存重新编译

## 📄 许可证

MIT License

## 👨‍💻 开发者

本项目使用 Coze 平台开发，基于 Taro 框架构建。

---

**祝你玩得开心！** 🎉
