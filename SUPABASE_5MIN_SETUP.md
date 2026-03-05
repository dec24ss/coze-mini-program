# 🚀 Supabase 5分钟快速配置指南

## ⚡ 为什么需要配置？

Supabase 是一个免费的云数据库服务，我们需要你创建一个项目来存储排行榜数据。**整个过程只需要 5 分钟！**

---

## 📋 配置步骤（5分钟搞定）

### 第1步：创建 Supabase 账号（1分钟）

1. 打开浏览器访问：https://supabase.com
2. 点击右上角 **"Start your project"**
3. 使用 **GitHub 账号**登录（如果没有 GitHub，先注册一个）
4. 登录成功后会跳转到 Dashboard

### 第2步：创建 Supabase 项目（2分钟）

1. 在 Dashboard 页面，点击 **"New Project"** 按钮
2. 填写以下信息：
   - **Name**: 输入项目名称，如 `puzzle-game`
   - **Database Password**: 输入密码（务必记住，至少 10 个字符）
   - **Region**: 选择 `Southeast Asia (Singapore)`（选择离你最近的地区）
   - **Pricing Plan**: 选择 **Free**（免费套餐）
3. 点击 **"Create new project"**
4. 等待项目创建完成（约 1-2 分钟）

### 第3步：获取 Supabase 凭证（1分钟）

项目创建完成后：

1. 在左侧菜单点击 **Settings**（齿轮图标）
2. 点击 **API** 子菜单
3. 找到以下两个凭证：

```
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

4. **复制**这两个凭证，稍后会用到

### 第4步：创建数据库表（1分钟）

1. 在左侧菜单点击 **SQL Editor**（图标像一个代码编辑器）
2. 点击 **"New query"** 按钮
3. 复制以下 SQL 代码并粘贴到编辑器中：

```sql
-- 创建用户表
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

-- 创建索引以提升查询性能
CREATE INDEX IF NOT EXISTS idx_users_openid ON users(openid);
CREATE INDEX IF NOT EXISTS idx_users_highest_level ON users(highest_level DESC);

-- 插入测试数据（可选）
INSERT INTO users (openid, nickname, avatar_url, highest_level, points)
VALUES
  ('test_user_1', '拼图大师', 'https://example.com/avatar1.jpg', 15, 100),
  ('test_user_2', '拼图高手', 'https://example.com/avatar2.jpg', 12, 80),
  ('test_user_3', '拼图达人', 'https://example.com/avatar3.jpg', 10, 60)
ON CONFLICT (openid) DO NOTHING;
```

4. 点击右下角的 **"Run"** 按钮执行
5. 看到 "Success" 提示表示表创建成功

### 第5步：配置环境变量（30秒）

有两种方式配置，任选其一：

#### 方式 A：在 Coze 工作台配置（推荐）

1. 打开 Coze 工作台
2. 进入你的工作空间
3. 找到 **Environment Variables** 配置
4. 添加以下两个环境变量：

```
COZE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
COZE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

（替换为你刚才复制的实际凭证）

5. 保存配置

#### 方式 B：本地配置文件

1. 复制项目根目录的 `.env.example` 文件：
   ```bash
   cp .env.example .env.local
   ```

2. 编辑 `.env.local` 文件，填入你的凭证：
   ```env
   COZE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   COZE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. 保存文件

---

## ✅ 验证配置

配置完成后，验证一下是否成功：

1. 启动项目：
   ```bash
   pnpm dev
   ```

2. 打开小程序
3. 登录账号
4. 点击"排行榜"按钮
5. 如果能看到 3 个测试用户的排行榜数据，说明配置成功！

---

## 🎉 完成！

现在你的拼图游戏已经集成了 Supabase 排行榜功能！

**功能特性**：
- ✅ 真实的排行榜数据
- ✅ 用户数据自动同步
- ✅ 全球玩家排名
- ✅ 免费云数据库（无需自己搭建服务器）

---

## 💡 常见问题

### Q: 必须使用 Supabase 吗？

A: 不是必须的，但强烈推荐，因为：
- Supabase 完全免费（有 generous 的免费额度）
- 配置简单（5分钟搞定）
- 数据安全可靠
- 性能优秀

### Q: 忘记 Supabase 密码怎么办？

A: Supabase 密码只在创建项目时使用一次，之后不需要了。如果你需要重置数据库密码，可以在 Supabase 控制台的 Database → Settings 中操作。

### Q: 配置错误怎么办？

A: 检查以下几点：
1. 确认 Project URL 和 anon key 复制正确（不要有多余的空格）
2. 确认环境变量名称正确（`COZE_SUPABASE_URL` 和 `COZE_SUPABASE_ANON_KEY`）
3. 查看控制台错误日志

### Q: 排行榜数据为空怎么办？

A:
1. 确认已执行第4步的 SQL 脚本
2. 确认环境变量配置正确
3. 等待数据库初始化完成（可能需要几秒）

### Q: 如何删除测试数据？

A: 在 Supabase SQL Editor 中执行：
```sql
DELETE FROM users WHERE openid LIKE 'test_user_%';
```

---

## 📞 需要帮助？

如果遇到问题：
1. 查看 Supabase 控制台的 Logs（查看数据库日志）
2. 查看浏览器控制台（查看前端错误）
3. 查看 `server/SUPABASE_SETUP.md` 详细文档

---

## 🔐 安全提示

- 不要将 `.env.local` 文件提交到 Git 仓库
- 不要分享你的 Supabase 凭证
- 定期更换数据库密码（在 Supabase 控制台）

---

**配置完成后，你的拼图游戏就可以拥有真实的排行榜了！🎮**
