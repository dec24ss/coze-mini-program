# 拼图小程序

一个基于 Taro 框架开发的微信小程序拼图游戏，支持多种难度、关卡系统和排行榜功能。

## 🎯 功能特性

- 🧩 拼图游戏：支持 3×3 到 7×7 难度
- 🎮 关卡系统：100+ 关卡，难度递增
- 🏆 排行榜：实时排名，展示最高通关记录
- 👤 用户系统：微信登录、头像上传、昵称设置
- 🎵 音效反馈：背景音乐、音效、震动反馈
- 📱 跨端支持：微信小程序、H5 网页

## 🛠️ 技术栈

### 前端
- **框架**: Taro 4.1.9
- **UI 框架**: React 18
- **语言**: TypeScript
- **样式**: Tailwind CSS 4
- **状态管理**: Zustand 5
- **图标库**: lucide-react-taro

### 后端
- **框架**: NestJS
- **数据库**: Supabase PostgreSQL
- **对象存储**: coze-coding-dev-sdk (S3Storage)
- **图片服务**: Lorem Picsum CDN

## 🚀 快速开始

### 环境要求

- Node.js >= 16
- pnpm >= 9.0.0
- 微信开发者工具

### 安装依赖

```bash
pnpm install
```

### 本地开发

```bash
# 启动前端开发服务器（H5）
pnpm dev

# 构建微信小程序
pnpm build:weapp

# 构建后端服务
pnpm build:server
```

### 微信小程序开发

1. 安装微信开发者工具
2. 构建项目：`pnpm build:weapp`
3. 在微信开发者工具中打开 `dist` 目录
4. 配置 AppID（测试时可使用测试号）
5. 点击"编译"预览效果

### 部署

#### 前端部署

```bash
# 构建生产版本
pnpm build

# 部署到 veFaaS 平台
# 系统会自动执行部署脚本
```

#### 后端部署

```bash
# 构建后端
pnpm build:server

# 部署到 veFaaS 平台
# 系统会自动执行 deploy_run.sh 启动服务
```

## 📋 配置说明

### 环境变量

在 `server/.env` 文件中配置：

```bash
# Supabase 配置
COZE_SUPABASE_URL=https://your-project.supabase.co
COZE_SUPABASE_ANON_KEY=your-anon-key

# 对象存储配置（可选，用于头像上传）
COZE_BUCKET_ENDPOINT_URL=https://your-bucket-endpoint
COZE_BUCKET_NAME=your-bucket-name
```

### Supabase 数据库

执行以下 SQL 创建表结构：

```sql
-- 创建用户表
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  openid TEXT UNIQUE NOT NULL,
  nickname TEXT,
  avatar_url TEXT,
  highest_level INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 启用 RLS（行级安全）
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 允许所有操作（生产环境需要更严格的安全策略）
CREATE POLICY "Allow all" ON users FOR ALL USING (true) WITH CHECK (true);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 🎮 游戏玩法

1. **登录**: 打开小程序，点击"开始游戏"进行微信登录
2. **选择关卡**: 点击"关卡选择"选择要挑战的关卡
3. **开始游戏**: 点击关卡进入游戏，拖拽交换碎片位置
4. **完成拼图**: 将所有碎片放到正确位置即可通关
5. **查看排行**: 点击"排行榜"查看玩家排名

## 📱 界面说明

- **加载页**: 显示加载动画，预加载资源
- **首页**: 显示用户信息、功能按钮、排行榜入口
- **游戏页**: 显示拼图游戏界面、计时器、步数
- **关卡选择页**: 显示所有关卡，未解锁关卡显示锁图标
- **排行榜页**: 显示玩家排行榜

## 🔧 开发指南

### 项目结构

```
src/
├── components/      # 公共组件
│   ├── user-profile-modal/  # 用户资料弹窗
│   └── settings-modal/     # 设置弹窗
├── pages/            # 页面
│   ├── loading/      # 加载页
│   ├── index/        # 首页
│   ├── game/         # 游戏页
│   ├── level-select/ # 关卡选择页
│   └── rank/         # 排行榜页
├── stores/           # 状态管理
│   ├── userStore.ts  # 用户状态
│   ├── gameStore.ts  # 游戏状态
│   └── settingsStore.ts # 设置状态
├── utils/            # 工具函数
└── app.tsx           # 应用入口

server/
├── src/
│   ├── image/        # 图片服务
│   ├── users/        # 用户服务
│   └── main.ts       # 后端入口
└── dist/             # 构建产物
```

### API 接口

#### 用户相关
- `POST /api/users/login` - 用户登录
- `GET /api/users/:openid` - 获取用户信息
- `POST /api/users/update` - 更新用户信息
- `GET /api/users/rank/list` - 获取排行榜
- `POST /api/users/upload-avatar` - 上传头像

#### 图片相关
- `GET /api/images/list` - 获取图片列表
- `GET /api/images/random` - 获取随机图片列表

## 🐛 问题排查

### 登录失败
1. 检查后端服务是否正常启动
2. 检查 Supabase 数据库连接是否正常
3. 查看控制台日志，查看具体错误信息

### 图片加载失败
1. 检查网络连接是否正常
2. 检查图片服务是否正常
3. 查看控制台日志，确认图片 URL 是否正确

### 排行榜不显示
1. 检查是否已登录
2. 检查数据库中是否有用户数据
3. 查看控制台日志，确认接口调用是否成功

## 📄 版本历史

详细版本历史请查看 [CHANGELOG.md](./CHANGELOG.md)

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📧 联系方式

如有问题，请联系开发团队。
