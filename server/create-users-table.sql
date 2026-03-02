-- 创建 users 表
CREATE TABLE IF NOT EXISTS public.users (
  id SERIAL PRIMARY KEY,
  openid TEXT NOT NULL UNIQUE,
  nickname TEXT,
  avatar_url TEXT,
  highest_level INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 启用行级安全策略
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 创建公开读取策略
CREATE POLICY "users_允许公开读取" ON public.users
  FOR SELECT
  TO public
  USING (true);

-- 创建公开插入策略
CREATE POLICY "users_允许公开写入" ON public.users
  FOR INSERT
  TO public
  WITH CHECK (true);

-- 创建公开更新策略
CREATE POLICY "users_允许公开更新" ON public.users
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- 创建公开删除策略
CREATE POLICY "users_允许公开删除" ON public.users
  FOR DELETE
  TO public
  USING (true);
