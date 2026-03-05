-- Supabase 数据库表结构
-- 拼图游戏用户数据表

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
CREATE INDEX IF NOT EXISTS idx_users_points ON users(points DESC);

-- 创建健康检查表（用于数据库连接测试）
CREATE TABLE IF NOT EXISTS health_check (
  id SERIAL PRIMARY KEY,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建更新时间的触发器（自动更新 updated_at 字段）
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 为 users 表创建触发器
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 插入一些测试数据（可选）
INSERT INTO users (openid, nickname, avatar_url, highest_level, points)
VALUES
  ('test_user_1', '拼图大师', 'https://example.com/avatar1.jpg', 15, 100),
  ('test_user_2', '拼图高手', 'https://example.com/avatar2.jpg', 12, 80),
  ('test_user_3', '拼图达人', 'https://example.com/avatar3.jpg', 10, 60)
ON CONFLICT (openid) DO NOTHING;

-- 查询排行榜（测试）
SELECT
  openid,
  nickname,
  avatar_url,
  highest_level,
  points,
  ROW_NUMBER() OVER (ORDER BY highest_level DESC) as rank
FROM users
ORDER BY highest_level DESC
LIMIT 10;

-- 注意事项：
-- 1. 确保在 Supabase 项目中已启用 PostgreSQL 数据库
-- 2. 在 Supabase 控制台的 SQL Editor 中执行此脚本
-- 3. 配置环境变量：
--    - COZE_SUPABASE_URL: 你的 Supabase 项目 URL
--    - COZE_SUPABASE_ANON_KEY: 你的 Supabase 匿名密钥
-- 4. 确保 RLS（Row Level Security）策略正确配置（如果需要）
