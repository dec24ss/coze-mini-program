# Vercel 部署指南

本指南将帮助你将拼图游戏部署到 Vercel 平台。

## 步骤 1：准备工作

1. **创建 Vercel 账号**：如果还没有 Vercel 账号，访问 [Vercel 官网](https://vercel.com/) 注册一个。

2. **安装 Vercel CLI**：
   ```bash
   npm install -g vercel
   ```

3. **登录 Vercel**：
   ```bash
   vercel login
   ```

## 步骤 2：配置项目

1. **项目结构**：确保项目结构如下：
   - `server/` - NestJS 后端服务
   - `src/` - 前端源代码
   - `vercel.json` - Vercel 配置文件

2. **环境变量**：
   - 在 Vercel 项目设置中添加以下环境变量：
     - `COZE_SUPABASE_URL` - Supabase 项目 URL
     - `COZE_SUPABASE_ANON_KEY` - Supabase 匿名密钥
     - `PORT` - 服务器端口（默认 3000）
     - `NODE_ENV` - 环境类型（设置为 production）

## 步骤 3：部署项目

1. **进入项目目录**：
   ```bash
   cd d:\openclaw\projects
   ```

2. **初始化 Vercel 项目**：
   ```bash
   vercel
   ```

3. **配置部署选项**：
   - 选择「Create a New Project」
   - 项目名称：`puzzle-game-six-mauve`
   - 选择默认的构建和输出设置

4. **部署到生产环境**：
   ```bash
   vercel --prod
   ```

## 步骤 4：更新前端配置

1. **修改网络配置**：更新 `src/network.ts` 中的 `PROJECT_DOMAIN` 为 Vercel 部署的域名。

2. **重新构建前端**：
   ```bash
   npm run build:web
   ```

3. **重新部署**：
   ```bash
   vercel --prod
   ```

## 步骤 5：验证部署

1. **访问部署的应用**：打开 Vercel 提供的 URL（如 `https://puzzle-game-six-mauve.vercel.app`）

2. **测试功能**：
   - 打开游戏首页
   - 测试关卡选择
   - 测试游戏功能
   - 测试排行榜功能

## 常见问题

### 1. 部署失败
- 检查 Vercel 构建日志
- 确保所有依赖已正确安装
- 检查环境变量配置

### 2. API 调用失败
- 检查 `PROJECT_DOMAIN` 是否正确设置
- 确保后端服务正常运行
- 检查网络请求是否正确

### 3. 数据库连接失败
- 检查 Supabase 配置是否正确
- 确保 Supabase 项目已启用
- 检查网络连接

## 部署成功后

部署成功后，你可以：
- 分享游戏链接给朋友
- 在 Vercel 控制台查看部署状态和日志
- 设置自定义域名（可选）

---

**部署完成！** 你的拼图游戏现在已经部署到 `puzzle-game-six-mauve.vercel.app`。