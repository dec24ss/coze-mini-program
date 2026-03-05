# Supabase 排行榜配置指南

## 概述

本项目已集成 Supabase 数据库，用于存储用户数据和排行榜信息。

## 数据库表结构

### users 表

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | SERIAL | 主键，自增 |
| openid | TEXT | 用户唯一标识（微信 openid） |
| nickname | TEXT | 用户昵称 |
| avatar_url | TEXT | 用户头像 URL |
| highest_level | INTEGER | 最高过关关卡 |
| points | INTEGER | 用户积分 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

## 配置步骤

### 1. 创建 Supabase 项目

1. 访问 [Supabase 官网](https://supabase.com)
2. 注册/登录账号
3. 创建新项目，记住项目 URL 和 API 密钥

### 2. 创建数据库表

在 Supabase 控制台的 SQL Editor 中执行 `server/database/supabase-schema.sql` 中的 SQL 脚本。

### 3. 配置环境变量

在 Coze 工作台的 Environment Variables 中添加以下配置：

```env
COZE_SUPABASE_URL=https://your-project.supabase.co
COZE_SUPABASE_ANON_KEY=your-anon-key
```

或者在本地开发时，在项目根目录创建 `.env.local` 文件：

```env
COZE_SUPABASE_URL=https://your-project.supabase.co
COZE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. 获取 Supabase 凭证

在 Supabase 项目控制台中：
- 进入 Settings → API
- 复制 Project URL
- 复制 anon public key（或 anon public key）

### 5. 验证配置

启动项目后，访问排行榜页面，应该能看到真实的排行榜数据。

## API 端点

后端已实现以下 API 端点：

### 用户相关

- `POST /api/users/login` - 用户登录/注册
- `GET /api/users/:openid` - 获取用户信息
- `POST /api/users/update` - 更新用户信息
- `POST /api/users/update-level` - 更新最高关卡
- `POST /api/users/add-points` - 添加积分
- `POST /api/users/consume-points` - 使用积分
- `GET /api/users/rank/list` - 获取排行榜（前10名）

### 响应格式

所有 API 返回统一格式：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    // 实际数据
  }
}
```

## 排行榜功能

### 数据同步策略

- **本地优先**：用户数据先保存到本地存储
- **后台同步**：异步同步到 Supabase 数据库
- **失败重试**：如果同步失败，不影响本地使用

### 排行榜规则

- 按 `highest_level` 降序排列
- 显示前 10 名玩家
- 当前用户排名单独显示
- 实时更新

## 常见问题

### Q: 为什么排行榜数据是空的？

A: 检查以下几点：
1. Supabase 数据库是否正确创建
2. 环境变量是否正确配置
3. 是否有用户数据插入到数据库

### Q: 数据同步失败怎么办？

A: 数据同步失败不会影响本地使用，可以：
1. 检查网络连接
2. 查看控制台错误日志
3. 确认 Supabase 凭证是否正确

### Q: 如何重置排行榜数据？

A: 在 Supabase SQL Editor 中执行：

```sql
TRUNCATE TABLE users RESTART IDENTITY CASCADE;
```

## 安全性建议

1. **使用 RLS（Row Level Security）**
   - 在 Supabase 控制台启用 RLS
   - 配置适当的访问策略

2. **限制匿名访问**
   - 使用 service_role key 替代 anon key（如果需要）
   - 或者配置 RLS 策略限制访问

3. **定期备份数据**
   - 在 Supabase 控制台配置自动备份
   - 定期导出数据

## 性能优化

已实现的优化：
- 数据库索引（openid, highest_level, points）
- 自动更新 updated_at 触发器
- 限制排行榜返回数量（10条）

建议的进一步优化：
- 添加缓存层（Redis）
- 分页查询支持
- 批量操作优化

## 扩展功能

可以考虑添加的功能：
- 全球排行榜（按地区）
- 好友排行榜
- 排行榜历史记录
- 成就系统
- 徽章系统

## 相关文档

- [Supabase 官方文档](https://supabase.com/docs)
- [Supabase JavaScript 客户端](https://supabase.com/docs/reference/javascript)
- [项目后端代码](./src/users/)

## 技术支持

如有问题，请查看：
1. 项目日志（`/tmp/coze-logs/`）
2. Supabase 控制台的日志
3. 浏览器控制台的错误信息
