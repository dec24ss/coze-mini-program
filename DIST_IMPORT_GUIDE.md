# 微信开发者工具导入说明（重要）

## ⚠️ 常见错误

### 错误：app.json: 未找到 ["pages"][0] 对应的 pages/loading/index.wxml 文件

**原因**：你导入的是源代码目录（src/），而不是编译后的微信小程序代码（dist/）。

**解决方案**：

### ✅ 正确导入方式

#### 方法1：使用 dist 目录（推荐）

1. 解压压缩包
2. 打开微信开发者工具
3. 点击「项目」→「导入项目」
4. **选择 `dist` 文件夹**（而不是项目根目录）
5. 填写 AppID（或选择测试号）
6. 点击「导入」

#### 方法2：使用项目根目录（需重新构建）

1. 解压压缩包
2. 在项目根目录安装依赖：
   ```bash
   npm install
   # 或
   pnpm install
   ```
3. 构建微信小程序：
   ```bash
   npm run build:weapp
   # 或
   pnpm build:weapp
   ```
4. 打开微信开发者工具
5. 选择项目根目录导入
6. 点击「工具」→「构建 npm」

## 📁 目录结构说明

```
puzzle-game-export/
├── src/           # 源代码（TypeScript，不能直接导入）
├── dist/          # 编译后的微信小程序代码（✅ 直接导入这个）
├── config/        # 配置文件
├── package.json   # 依赖配置
└── ...
```

## 🔧 区别

| 目录 | 说明 | 是否可直接导入 |
|------|------|----------------|
| `src/` | TypeScript 源代码 | ❌ 不可以 |
| `dist/` | 编译后的微信小程序代码 | ✅ 可以 |

## ✅ 快速检查

导入前检查是否包含以下文件：
- `dist/app.json` ✅
- `dist/app.js` ✅
- `dist/pages/loading/index.wxml` ✅
- `dist/pages/loading/index.wxss` ✅
- `dist/pages/loading/index.js` ✅

如果包含以上文件，说明是编译后的代码，可以直接导入。

## 🆘 如果仍有问题

1. 确保选择的是 `dist` 文件夹，而不是项目根目录
2. 删除开发者工具中的项目，重新导入
3. 清除开发者工具缓存（设置 → 通用设置 → 清除缓存）
