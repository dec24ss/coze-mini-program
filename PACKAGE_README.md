# 📦 项目压缩包使用指南

## 🎯 压缩包内容

**文件名**: `puzzle-game-complete.tar.gz`
**大小**: 约 41 MB
**内容**: 完整的项目源代码

## 📋 包含的文件夹

### 核心源代码
- ✅ **src/** - 前端源代码（Taro + React + TypeScript）
  - pages/ - 所有页面
  - stores/ - 状态管理
  - components/ - 组件
  - network/ - 网络请求
  - cloudbase/ - 云开发配置

- ✅ **server/** - 后端源代码（NestJS）
  - src/ - 后端代码
  - public/ - 静态资源

- ✅ **cloudfunctions/** - 云函数
  - users/ - 用户管理云函数
  - rank/ - 排行榜云函数
  - updateUser/ - 更新用户信息云函数

### 配置文件
- ✅ **config/** - 配置文件
- ✅ **types/** - 类型定义
- ✅ **public/** - 公共资源
- ✅ **assets/** - 资源文件
- ✅ **key/** - 密钥配置

### 项目配置
- ✅ package.json - 项目依赖
- ✅ tsconfig.json - TypeScript 配置
- ✅ pnpm-lock.yaml - 依赖锁定文件
- ✅ .gitignore - Git 忽略规则
- ✅ project.config.json - 小程序配置

### 文档
- ✅ README.md - 项目说明
- ✅ ENABLE_CLOUDBASE.md - 云开发启用指南
- ✅ EXPORT_GUIDE.md - 导出部署指南
- ✅ CLOUDBASE_STATUS.md - 云开发状态检查
- ✅ design_guidelines.md - 设计规范

## 🚀 使用步骤

### 第 1 步：解压文件

**Windows (使用 7-Zip 或 WinRAR)**：
```
右键点击文件 -> 7-Zip -> 解压到当前文件夹
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

### 第 3 步：启动开发环境

```bash
pnpm dev
```

### 第 4 步：构建小程序

```bash
pnpm build:weapp
```

## 🔧 开发命令

```bash
# 安装依赖
pnpm install

# 启动开发环境（前端 + 后端）
pnpm dev

# 仅启动前端
pnpm dev:web

# 仅启动后端
pnpm dev:server

# 构建微信小程序
pnpm build:weapp

# 构建 H5 版本
pnpm build:web

# 构建后端
pnpm build:server

# 代码检查
pnpm lint:build && pnpm tsc
```

## ☁️ 启用云开发

如果你想使用云开发功能（多设备同步、排行榜等），请：

1. 查看 **`ENABLE_CLOUDBASE.md`** 文件
2. 按照步骤开通云开发
3. 修改 `src/cloudbase/index.ts` 配置
4. 部署云函数
5. 重新构建项目

## 📱 导入微信开发者工具

### 方法一：直接导入源码
1. 打开微信开发者工具
2. 导入项目文件夹
3. 安装依赖：在终端运行 `pnpm install`
4. 构建：运行 `pnpm build:weapp`
5. 点击「编译」预览

### 方法二：构建后导入
1. 先运行 `pnpm build:weapp` 构建
2. 导入 `dist` 文件夹到微信开发者工具
3. 点击「编译」预览

## ⚠️ 注意事项

### 依赖安装
- 必须使用 **pnpm** 安装依赖
- 如果安装失败，尝试删除 `node_modules` 和 `pnpm-lock.yaml` 后重新安装

### 构建问题
- 确保已安装 Node.js 18+
- 确保已安装 pnpm：`npm install -g pnpm`
- 如果构建失败，检查 TypeScript 错误

### 云开发
- 云开发默认禁用（`USE_CLOUDBASE = false`）
- 启用前请先开通腾讯云开发
- 需要部署云函数才能使用

## 🆘 常见问题

### Q: 安装依赖失败？
A: 
1. 确保使用 pnpm：`npm install -g pnpm`
2. 删除 `node_modules` 重新安装
3. 检查网络连接

### Q: 构建失败？
A:
1. 检查 TypeScript 错误：`pnpm tsc`
2. 清除缓存重新构建
3. 查看错误日志

### Q: 微信开发者工具预览白屏？
A:
1. 检查控制台错误
2. 确保构建成功
3. 清除缓存重新编译

### Q: 云开发不可用？
A:
1. 查看 `ENABLE_CLOUDBASE.md` 启用指南
2. 确保已开通云开发
3. 检查环境 ID 是否正确

## 📞 获取帮助

- 查看 `README.md` 了解项目详情
- 查看 `ENABLE_CLOUDBASE.md` 了解云开发配置
- 查看 `EXPORT_GUIDE.md` 了解导出部署
- 查看微信开发者工具控制台错误日志

---

**项目已完整打包，祝你开发顺利！** 🎉
