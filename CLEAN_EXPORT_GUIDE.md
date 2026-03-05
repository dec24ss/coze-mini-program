# 🧹 干净导出使用指南

## ✅ 问题已解决

之前的导出包中包含了：
- ❌ 符号链接文件（导致解压缩失败）
- ❌ node_modules/（超大文件夹）
- ❌ dist/（构建产物）
- ❌ 其他临时文件

现在的干净导出包只包含：
- ✅ 源代码（src/）
- ✅ 云函数（cloudfunctions/）
- ✅ 后端服务（server/）
- ✅ 静态资源（public/、assets/）
- ✅ 配置文件
- ✅ 文档文件

---

## 📦 使用新的导出包

### 导出包位置
`puzzle-game-clean-export.tar.gz`

### 如何解压

#### Linux/Mac
```bash
tar -xzf puzzle-game-clean-export.tar.gz
```

#### Windows
使用 7-Zip、WinRAR 或其他压缩工具解压

---

## 🚀 解压后操作

### 1. 进入项目目录
```bash
cd puzzle-game-clean-export
```

### 2. 安装依赖
```bash
pnpm install
```

### 3. 开发运行
```bash
pnpm dev
```

### 4. 构建
```bash
pnpm build
```

---

## 📋 导出包内容清单

```
puzzle-game-clean-export/
├── 📁 src/                    # 源代码
├── 📁 cloudfunctions/         # 云函数
├── 📁 server/                # 后端服务
├── 📁 public/                # 公共资源
├── 📁 assets/                # 静态资源
├── 📁 types/                 # TypeScript 类型
├── 📄 package.json           # 项目配置
├── 📄 pnpm-lock.yaml         # 依赖锁定
├── 📄 project.config.json    # 小程序配置
├── 📄 tsconfig.json          # TypeScript 配置
├── 📄 .gitignore             # Git 忽略文件
└── 📄 *.md                   # 文档文件
```

---

## 🛠️ 重新导出（如果需要）

如果你需要自己重新导出，可以使用提供的脚本：

### Linux/Mac
```bash
chmod +x clean-export.sh
./clean-export.sh
```

### Windows
双击运行 `clean-export.bat`，然后手动压缩生成的文件夹

---

## ✅ 验证导出包

解压后检查：
- [ ] 没有符号链接文件（app.js、pages/ 等软链接）
- [ ] 没有 node_modules/ 文件夹
- [ ] 没有 dist/ 文件夹
- [ ] 所有源文件都在
- [ ] 可以正常解压
- [ ] 可以正常安装依赖

---

## 🆘 还是有问题？

如果还是遇到解压缩问题：

1. **尝试不同的解压工具**
   - Windows: 7-Zip、WinRAR、Bandizip
   - Mac: 自带归档工具、Keka、The Unarchiver
   - Linux: tar、unzip

2. **检查文件完整性**
   - 确认下载的文件大小正确（约 20MB）
   - 重新下载导出包

3. **手动复制文件**
   - 直接从项目中复制需要的源文件
   - 避免复制符号链接和构建产物
