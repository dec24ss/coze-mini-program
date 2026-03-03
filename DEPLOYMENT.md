# 拼图小程序 v1.2.0 部署指南

## 📋 版本信息

- **版本号**: v1.2.0
- **发布日期**: 2026-03-02
- **构建状态**: ✅ 通过

---

## 🎯 版本更新内容

### 主要功能
- ✅ 将数据库从 SQLite 迁移到 Supabase 云数据库
- ✅ 实现头像上传到对象存储功能
- ✅ 修复排行榜头像显示问题
- ✅ 排行榜显示前100名用户
- ✅ 完成所有功能测试和代码检查
- ✅ 清空排行榜数据

### 技术栈
- **前端**: Taro 4.1.9 + React 18 + TypeScript + Tailwind CSS 4
- **后端**: NestJS + Supabase
- **数据库**: Supabase PostgreSQL
- **对象存储**: S3 兼容对象存储
- **状态管理**: Zustand 5

---

## 📦 部署文件

### 已生成的构建文件
```
dist/                    # 微信小程序构建产物
  ├── app.js             # 小程序主文件
  ├── app.json           # 小程序配置
  ├── app.wxss           # 小程序样式
  ├── pages/             # 页面文件
  ├── common.js          # 公共代码
  ├── vendors.js         # 第三方库
  └── ...

dist-web/                # H5 构建产物
  ├── index.html         # 入口文件
  └── js/                # JavaScript 文件

server/dist/             # 后端构建产物
  ├── main.js            # 后端入口
  └── ...                # 其他文件
```

---

## 🚀 部署步骤

### 1. 环境准备

#### 1.1 安装依赖
```bash
# 克隆项目
git clone <repository-url>
cd coze-mini-program

# 安装依赖
pnpm install
```

#### 1.2 配置环境变量

**⚠️ 重要：必须配置前端环境变量！**

在项目根目录创建 `.env.local` 文件（用于前端构建）：

```bash
# 项目域名（后端API地址）
# 本地开发：http://localhost:3000
# 生产环境：https://your-server.com（⚠️ 必须修改为你的实际后端服务器地址！）
PROJECT_DOMAIN=http://localhost:3000
```

**生产环境配置示例**：
```bash
# 假设你的后端部署在 https://api.example.com
PROJECT_DOMAIN=https://api.example.com
```

**⚠️ 注意**：
- 如果不配置 `PROJECT_DOMAIN`，API请求会失败
- 生产环境必须使用HTTPS协议
- 域名需要在微信小程序后台配置白名单（见下一步）

在 `server/.env` 文件中配置后端环境变量：

```bash
# Supabase 配置（必填）
COZE_SUPABASE_URL=https://egutrdawrbziyklwnuov.supabase.co
COZE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVndXRyZGF3cmJ6aXlrbHdudW92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0MjUwMTEsImV4cCI6MjA4ODAwMTAxMX0.PKGOVO2ItYvesw714VRdGxuTjGgNw5WU2LHTDLObQfs

# 对象存储配置（头像上传功能需要）
COZE_BUCKET_ENDPOINT_URL=
COZE_BUCKET_NAME=
```

#### 1.3 微信小程序域名白名单配置（⚠️ 线上版必做！）

**问题现象**：开发版正常，线上版图片和数据库加载失败

**原因**：微信小程序正式版必须在公众平台配置域名白名单

**详细配置指南**：请参考 [`docs/WECHAT_DOMAIN_CONFIG.md`](docs/WECHAT_DOMAIN_CONFIG.md)

**快速配置**：

1. 登录微信公众平台：https://mp.weixin.qq.com
2. 进入「开发」→「开发管理」→「开发设置」→「服务器域名」

3. 配置以下域名：

**request 合法域名**：
```
https://your-server.com
https://egutrdawrbziyklwnuov.supabase.co
```

**uploadFile 合法域名**：
```
https://your-server.com
https://egutrdawrbziyklwnuov.supabase.co
```

**downloadFile 合法域名**：
```
https://picsum.photos
https://api.dicebear.com
https://images.unsplash.com
https://assets.mixkit.co
```

**各域名用途说明**：
- `picsum.photos` - 拼图图片（随机高质量图片，共100张）
- `api.dicebear.com` - 用户默认头像生成
- `images.unsplash.com` - 备用图片
- `assets.mixkit.co` - 游戏音效文件

**注意**：请将 `https://your-server.com` 替换为你实际的后端服务器域名。

#### 1.4 数据库配置

确保 Supabase 数据库中已创建 users 表：

```sql
-- 表结构已通过 coze-coding-ai db upgrade 同步
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  openid TEXT NOT NULL UNIQUE,
  nickname TEXT,
  avatar_url TEXT,
  highest_level INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引
CREATE UNIQUE INDEX IF NOT EXISTS users_openid_unique ON users(openid);
```

---

### 2. 后端部署

#### 2.1 编译后端（已完成）
```bash
cd server
pnpm build
```

#### 2.2 启动后端服务

**开发环境**：
```bash
cd server
pnpm start
```

**生产环境**：
```bash
cd server
node dist/main.js
```

后端服务默认运行在 `http://localhost:3000`

#### 2.3 使用 PM2 部署（推荐）
```bash
# 安装 PM2
npm install -g pm2

# 启动服务
pm2 start server/dist/main.js --name puzzle-game-server

# 查看状态
pm2 status

# 查看日志
pm2 logs puzzle-game-server

# 设置开机自启
pm2 startup
pm2 save
```

---

### 3. 微信小程序部署

#### 3.1 上传小程序

1. 打开微信开发者工具
2. 导入项目：选择 `dist` 目录
3. 配置 AppID（在 `dist/app.json` 中）
4. 点击"上传"按钮
5. 填写版本号和项目备注
6. 提交审核

#### 3.2 微信小程序配置

**域名白名单配置**：
- 登录微信公众平台
- 进入「开发」→「开发管理」→「开发设置」
- 配置服务器域名：

```
request合法域名：
- https://egutrdawrbziyklwnuov.supabase.co

uploadFile合法域名：
- https://egutrdawrbziyklwnuov.supabase.co

downloadFile合法域名：
- https://egutrdawrbziyklwnuov.supabase.co
- https://api.dicebear.com
```

#### 3.3 隐私设置

- 进入「设置」→「基本设置」
- 配置用户隐私保护指引
- 配置服务类目（游戏类）

---

### 4. H5 部署

#### 4.1 使用 Vercel 部署

```bash
# 安装 Vercel CLI
npm install -g vercel

# 部署
vercel --prod
```

#### 4.2 使用 Nginx 部署

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /path/to/dist-web;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 代理后端 API
    location /api/ {
        proxy_pass http://localhost:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔍 部署验证

### 1. 后端服务验证

```bash
# 检查服务状态
curl http://localhost:3000/api/health

# 测试排行榜接口
curl http://localhost:3000/api/users/rank/list
```

### 2. 数据库连接验证

创建测试脚本 `test-deployment.js`：

```javascript
const { getSupabaseClient } = require('./server/dist/storage/database/supabase-client');

async function testDeployment() {
  const client = getSupabaseClient();

  // 测试查询
  const { data, error } = await client
    .from('users')
    .select('*')
    .limit(1);

  if (error) {
    console.error('❌ 数据库连接失败:', error);
    process.exit(1);
  }

  console.log('✅ 部署验证通过');
  console.log('用户数:', data?.length || 0);
}

testDeployment();
```

运行测试：
```bash
node test-deployment.js
```

---

## 📊 监控和维护

### 1. 日志监控

```bash
# PM2 日志
pm2 logs puzzle-game-server

# Nginx 日志
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### 2. 性能监控

推荐使用：
- **Sentry**: 错误监控
- **Google Analytics**: 用户行为分析
- **Supabase Dashboard**: 数据库监控

### 3. 数据备份

Supabase 自动备份，也可以手动备份：

```bash
# 导出数据
pg_dump -h db.xxx.supabase.co -U postgres -d postgres > backup.sql
```

---

## 🔄 版本回滚

### 1. Git 回滚
```bash
# 查看标签
git tag -l

# 回滚到指定版本
git checkout v1.1.0

# 重新构建
pnpm build
```

### 2. PM2 回滚
```bash
# 停止服务
pm2 stop puzzle-game-server

# 切换到旧版本
cd /path/to/v1.1.0
node dist/main.js

# 使用 PM2 启动
pm2 restart puzzle-game-server
```

---

## 📝 配置清单

### 部署前检查清单

- [ ] **前端环境变量已配置**（`.env.local` 文件，设置 `PROJECT_DOMAIN`）
- [ ] **后端环境变量已配置**（`server/.env` 文件，设置 Supabase 配置）
- [ ] **数据库表已创建**（users 表已通过 `coze-coding-ai db upgrade` 同步）
- [ ] **微信小程序域名白名单已配置**（⚠️ 线上版必须！）
  - [ ] request 合法域名已添加后端API域名和Supabase域名
  - [ ] uploadFile 合法域名已添加后端API域名和Supabase域名
  - [ ] downloadFile 合法域名已添加图片域名（picsum.photos、api.dicebear.com）
- [ ] **后端服务正常运行**（可访问 http://localhost:3000/api）
- [ ] **微信小程序 AppID 已配置**（在 `project.config.json` 中）
- [ ] **对象存储配置**（如需头像上传功能）
- [ ] **防火墙端口已开放**（3000 端口）
- [ ] **SSL 证书已配置**（生产环境必须使用 HTTPS）

### 部署后检查清单

- [ ] 后端服务可访问
- [ ] 数据库连接正常
- [ ] 排行榜接口正常
- [ ] 用户登录功能正常
- [ ] 头像上传功能正常
- [ ] 小程序可正常打开
- [ ] H5 版本可正常访问
- [ ] 日志无错误信息

---

## 🆘 常见问题

### 1. 后端服务无法启动

**问题**: `Error: COZE_SUPABASE_URL is not set`

**解决方案**:
```bash
# 检查环境变量
echo $COZE_SUPABASE_URL

# 重新加载环境变量
source .env
```

### 2. 数据库连接失败

**问题**: `permission denied for table users`

**解决方案**:
```bash
# 检查 Supabase RLS 策略
# 确保公开读写权限已启用
```

### 3. 小程序无法加载图片

**问题**: `downloadFile:fail url not in domain list`

**解决方案**:
- 检查微信小程序域名白名单配置
- 确保所有图片域名都已添加

### 4. 头像上传失败

**问题**: `上传头像失败`

**解决方案**:
- 检查对象存储配置
- 确认 bucket 权限设置正确
- 检查网络连接

---

## 📞 技术支持

- **Supabase 文档**: https://supabase.com/docs
- **Taro 文档**: https://docs.taro.zone/
- **NestJS 文档**: https://docs.nestjs.com/
- **GitHub Issues**: https://github.com/your-repo/issues

---

## 🎉 部署完成

如果以上步骤都顺利完成，恭喜你！拼图小程序 v1.2.0 已成功部署。

**下一步**:
1. 监控服务运行状态
2. 收集用户反馈
3. 准备下一个版本迭代

---

**版本**: v1.2.0
**文档生成时间**: 2026-03-02
**维护者**: Development Team
