# 🛠️ Windows 安装指南

## ⚠️ better-sqlite3 编译失败问题

在 Windows 上安装 `better-sqlite3` 时可能会遇到编译失败的问题。这是因为 `better-sqlite3` 是一个需要编译的原生模块。

## 🚀 解决方案

### 方案一：使用简化版（推荐）

我已经创建了一个**不依赖 SQLite 的简化版本**，使用简单的 JSON 文件存储数据。

**步骤**：
1. 下载简化版压缩包：`puzzle-game-simple.tar.gz`
2. 解压后运行：`pnpm install`
3. 不会有编译错误

### 方案二：安装编译工具（高级用户）

如果你需要完整功能（包括数据库），需要安装 Windows 编译工具：

#### 1. 安装 Visual Studio Build Tools

下载并安装：
https://visualstudio.microsoft.com/visual-cpp-build-tools/

安装时勾选：
- ✅ MSVC v143 - VS 2022 C++ x64/x86 build tools
- ✅ Windows 10 SDK
- ✅ C++ CMake tools for Windows

#### 2. 安装 Python

下载并安装 Python 3.10+：
https://www.python.org/downloads/

安装时勾选：
- ✅ Add Python to PATH

#### 3. 安装 node-gyp

```bash
npm install -g node-gyp
npm install -g windows-build-tools
```

#### 4. 清理并重新安装

```bash
# 清理缓存
pnpm store prune

# 删除 node_modules
rm -rf node_modules
rm pnpm-lock.yaml

# 重新安装
pnpm install
```

### 方案三：使用 Docker（推荐高级用户）

如果你熟悉 Docker，可以使用 Docker 环境：

```bash
# 构建 Docker 镜像
docker build -t puzzle-game .

# 运行容器
docker run -p 3000:3000 -p 5000:5000 puzzle-game
```

## 📝 简化版说明

简化版与完整版的区别：

| 功能 | 简化版 | 完整版 |
|------|--------|--------|
| 游戏功能 | ✅ 完整 | ✅ 完整 |
| 图片加载 | ✅ 正常 | ✅ 正常 |
| 排行榜 | ✅ 本地存储 | ✅ 数据库 |
| 用户系统 | ✅ 本地存储 | ✅ 数据库 |
| 云开发 | ✅ 支持 | ✅ 支持 |
| 安装难度 | ⭐ 简单 | ⭐⭐⭐ 复杂 |

**建议**：对于个人使用和小型项目，简化版完全够用！

## 🔧 快速修复（如果你已经遇到错误）

如果你已经遇到 `better-sqlite3` 编译错误：

### 方法 1：忽略错误继续

```bash
# 忽略安装错误
pnpm install --ignore-scripts

# 手动安装其他依赖
pnpm install
```

### 方法 2：使用替代存储

修改后端代码，使用 JSON 文件存储替代 SQLite：

1. 打开 `server/src/storage/database/` 目录
2. 创建 `json-store.ts` 文件
3. 使用简单的 JSON 文件存储数据

### 方法 3：删除数据库功能

如果你不需要数据库：

```bash
# 删除 better-sqlite3 依赖
cd server
pnpm remove better-sqlite3 @types/better-sqlite3
```

然后修改相关代码，移除数据库引用。

## 📞 获取帮助

如果以上方法都无法解决：

1. 使用简化版压缩包
2. 或者使用在线版本（不安装）
3. 或者在 Linux/Mac 环境中开发

---

## ✅ 推荐方案

**对于大多数用户**：使用简化版
- 无需安装编译工具
- 无需处理复杂配置
- 功能完整，体验一致

**下载简化版**：`puzzle-game-simple.tar.gz`
