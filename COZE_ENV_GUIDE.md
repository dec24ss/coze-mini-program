# 🚀 Coze 编程环境使用指南

## ✅ 已完成的配置

我已经为 Coze 编程环境做了优化配置：

### 1. 修改了打包脚本
- ✅ `.cozeproj/scripts/pack.sh` - 现在只构建 Web 版本，跳过小程序构建（避免 BigInt 兼容性问题）

### 2. 修改了构建命令
- ✅ `package.json` - `pnpm build` 现在只运行 lint、tsc、web、server 构建
- ✅ 保留了 `pnpm build:all` 用于完整构建（包含小程序）

---

## 🎯 Coze 环境中的使用方式

### 方式一：预览 Web 版本（推荐）

Coze 环境会自动启动 Web 版本，你可以：

1. **等待服务启动**
   - Coze 会自动运行 `pnpm dev`
   - 等待启动完成

2. **在浏览器中预览**
   - 点击 Coze 界面上的"预览"按钮
   - 或访问显示的 URL（通常是 http://localhost:5000）

---

### 方式二：开发小程序

如果你需要开发小程序版本：

#### 1. 本地开发（推荐）

1. **在 Coze 中完成代码编写**
2. **下载项目到本地**
3. **在本地运行**：
   ```bash
   pnpm install
   pnpm dev:weapp
   ```
4. **在微信开发者工具中打开 `dist` 目录**

#### 2. 使用云开发控制台部署云函数

云函数部署不需要小程序构建，直接使用：

1. **访问云开发控制台**：https://console.cloud.tencent.com/tcb
2. **按 `QUICK_DEPLOY.md` 中的步骤手动部署云函数**

---

## 📁 Coze 环境中的项目结构

```
/workspace/projects/
├── 📁 src/              # 源代码（在这里写代码）
├── 📁 cloudfunctions/   # 云函数代码
├── 📁 server/           # 后端服务
├── 📄 .coze            # Coze 配置
├── 📄 .cozeproj/       # Coze 项目脚本
└── 📄 package.json
```

---

## 🔧 常用命令

### 在 Coze 终端中运行

```bash
# 安装依赖
pnpm install

# 启动开发服务（Web + 后端）
pnpm dev

# 代码检查
pnpm lint:build
pnpm tsc

# 构建（仅 Web + 后端）
pnpm build

# 完整构建（包含小程序，可能会有 BigInt 警告）
pnpm build:all
```

---

## ⚠️ 注意事项

### 1. 小程序构建限制

- ❌ 在 Coze 环境中不建议运行 `pnpm build:weapp`
- ❌ 会遇到 BigInt 兼容性警告
- ✅ 建议在本地开发环境中进行小程序开发和构建

### 2. 云函数部署

- ✅ 云函数代码在 `cloudfunctions/` 目录中
- ✅ 可以直接在 Coze 中编辑云函数代码
- ✅ 部署建议使用云开发控制台手动部署

### 3. Web 版本开发

- ✅ Web 版本在 Coze 环境中完全正常
- ✅ 可以实时预览和调试
- ✅ 热更新正常工作

---

## 🆘 常见问题

**Q: Coze 预览失败怎么办？**
A: 检查终端输出，确保 `pnpm dev` 正常启动，没有报错。

**Q: 小程序无法构建怎么办？**
A: 这是正常的，建议下载到本地，在本地开发环境中进行小程序开发。

**Q: 云函数如何部署？**
A: 参考 `QUICK_DEPLOY.md`，使用云开发控制台手动部署，最可靠。

**Q: 如何下载项目到本地？**
A: 在 Coze 界面中找到"下载"或"导出"功能，将项目下载到本地后继续开发。
