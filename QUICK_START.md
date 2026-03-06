# 🚀 快速开始指南

## ✅ 已解决 Windows 安装问题

**好消息**：这个版本已经移除了 `better-sqlite3` 依赖，不会再遇到编译错误！

## 📦 安装步骤

### 第 1 步：解压文件

**Windows (使用 7-Zip 或 WinRAR)**：
```
右键点击 puzzle-game-complete.tar.gz -> 7-Zip -> 解压到当前文件夹
```

**Mac/Linux**：
```bash
tar -zxf puzzle-game-complete.tar.gz
```

### 第 2 步：安装依赖

```bash
cd puzzle-game-complete
pnpm install
```

**注意**：这个版本不会遇到 `better-sqlite3` 编译错误！

### 第 3 步：启动开发环境

```bash
pnpm dev
```

### 第 4 步：构建小程序

```bash
pnpm build:weapp
```

## ✨ 主要改进

### ✅ 移除了问题依赖
- ❌ 移除 `better-sqlite3`（Windows 编译问题）
- ❌ 移除 `drizzle-orm` 和相关依赖
- ✅ 保留所有核心功能
- ✅ 使用云开发或本地存储

### ✅ 保留的功能
- ✅ 完整的游戏功能
- ✅ 图片加载和缓存
- ✅ 排行榜系统
- ✅ 用户系统
- ✅ 云开发支持
- ✅ 震动反馈

## 🎮 游戏特性

- 🎯 5种难度级别（3×3 到 7×7）
- 🏆 排行榜系统
- 🔓 关卡解锁机制
- 📱 适配手机的竖屏布局
- 🔊 震动反馈
- ☁️ 腾讯云开发（可选）

## ⚡ 快速命令

```bash
# 安装依赖
pnpm install

# 启动开发环境（前端 + 后端）
pnpm dev

# 构建微信小程序
pnpm build:weapp

# 构建 H5 版本
pnpm build:web

# 代码检查
pnpm lint:build && pnpm tsc
```

## 📱 导入微信开发者工具

### 方法一：构建后导入（推荐）
1. 运行 `pnpm build:weapp`
2. 打开微信开发者工具
3. 导入 `dist` 文件夹
4. 点击「编译」预览

### 方法二：直接导入源码
1. 打开微信开发者工具
2. 导入项目文件夹
3. 在终端运行 `pnpm install`
4. 运行 `pnpm build:weapp`
5. 点击「编译」预览

## ☁️ 启用云开发（可选）

如果你想使用云开发功能：

1. 查看 **`ENABLE_CLOUDBASE.md`** 文件
2. 按照步骤开通云开发
3. 修改 `src/cloudbase/index.ts` 配置
4. 部署云函数
5. 重新构建项目

## 🆘 常见问题

### Q: 安装依赖时报错？
A: 这个版本已经移除了所有问题依赖，不会遇到编译错误。如果还有问题：
- 确保使用 pnpm：`npm install -g pnpm`
- 清理缓存：`pnpm store prune`
- 删除 `node_modules` 重新安装

### Q: 构建失败？
A: 
1. 检查 TypeScript 错误：`pnpm tsc`
2. 清理缓存重新构建
3. 查看错误日志

### Q: 微信开发者工具预览白屏？
A:
1. 检查控制台错误
2. 确保构建成功
3. 清除缓存重新编译

### Q: 图片加载失败？
A: 检查网络连接，等待图片下载完成。

## 📄 更多文档

- **README.md** - 项目详细说明
- **ENABLE_CLOUDBASE.md** - 云开发启用指南
- **EXPORT_GUIDE.md** - 导出部署指南
- **CLOUDBASE_STATUS.md** - 云开发状态检查

---

**现在开始你的拼图游戏开发之旅吧！** 🎉
