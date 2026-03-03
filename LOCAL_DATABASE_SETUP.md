# 🚀 本地数据库（SQLite）配置指南

本项目已集成本地数据库方案，**零配置即可使用排行榜功能**！

---

## ✨ 方案特点

- ✅ **零配置**：无需注册任何服务，开箱即用
- ✅ **本地存储**：数据保存在项目文件中
- ✅ **完全免费**：无任何费用
- ✅ **易于迁移**：可随时切换到 PostgreSQL 或 Supabase

---

## 📁 数据库文件位置

数据库文件存储在：`server/data/puzzle-game.db`

数据库结构：
```
server/
└── data/
    └── puzzle-game.db  # SQLite 数据库文件
```

---

## 🗄️ 数据表结构

### users 表

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | INTEGER | 主键，自动递增 |
| openid | TEXT | 微信 openid（唯一） |
| nickname | TEXT | 用户昵称 |
| avatar_url | TEXT | 用户头像 URL |
| highest_level | INTEGER | 最高关卡 |
| points | INTEGER | 积分 |
| created_at | TEXT | 创建时间 |
| updated_at | TEXT | 更新时间 |

---

## 🔄 API 接口

所有接口都已在后端实现，前端可直接调用：

### 1. 用户登录/注册
```bash
POST /api/users/login
Content-Type: application/json

{
  "openid": "wx_openid_xxx",
  "nickname": "用户昵称",
  "avatar_url": "https://example.com/avatar.jpg"
}
```

### 2. 更新最高关卡
```bash
POST /api/users/update-level
Content-Type: application/json

{
  "openid": "wx_openid_xxx",
  "highest_level": 5
}
```

### 3. 获取排行榜
```bash
GET /api/users/rank/list
```

返回示例：
```json
{
  "code": 200,
  "msg": "success",
  "data": [
    {
      "openid": "test_user_456",
      "nickname": "测试用户2",
      "avatar_url": "https://example.com/avatar2.jpg",
      "highest_level": 10,
      "points": 0,
      "rank": 1
    },
    {
      "openid": "test_user_123",
      "nickname": "测试用户",
      "avatar_url": "https://example.com/avatar.jpg",
      "highest_level": 5,
      "points": 0,
      "rank": 2
    }
  ]
}
```

---

## 🧪 测试接口

### 测试登录接口
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"openid":"test_user_123","nickname":"测试用户","avatar_url":"https://example.com/avatar.jpg"}'
```

### 测试更新关卡
```bash
curl -X POST http://localhost:3000/api/users/update-level \
  -H "Content-Type: application/json" \
  -d '{"openid":"test_user_123","highest_level":5}'
```

### 测试排行榜
```bash
curl -X GET http://localhost:3000/api/users/rank/list
```

---

## 📊 数据库管理

### 查看数据库内容
使用 SQLite 命令行工具：
```bash
sqlite3 server/data/puzzle-game.db

# 查看所有表
.tables

# 查询所有用户
SELECT * FROM users;

# 退出
.quit
```

### 备份数据库
```bash
cp server/data/puzzle-game.db server/data/puzzle-game.db.backup
```

### 重置数据库
```bash
rm server/data/puzzle-game.db
# 重启服务器，数据库会自动创建
```

---

## 🆚 方案对比

| 特性 | SQLite | Supabase | PostgreSQL |
|------|--------|----------|------------|
| **配置难度** | ⭐ 零配置 | ⭐⭐⭐ 需要注册 | ⭐⭐⭐ 需要配置 |
| **费用** | ✅ 完全免费 | ✅ 免费额度 | 💰 需要服务器 |
| **性能** | ⭐⭐⭐ 够用 | ⭐⭐⭐⭐ 云端 | ⭐⭐⭐⭐⭐ 高性能 |
| **并发支持** | ⭐⭐ 单实例 | ⭐⭐⭐⭐ 高并发 | ⭐⭐⭐⭐⭐ 高并发 |
| **数据安全** | ⭐⭐ 本地文件 | ⭐⭐⭐⭐ 云端备份 | ⭐⭐⭐⭐ 专业数据库 |
| **适用场景** | 开发/小型应用 | 中小型应用 | 大型应用 |

---

## ❓ 常见问题

### Q: SQLite 数据库安全吗？
A: SQLite 适合开发和生产环境（中小型应用）。如果需要更高安全性或支持高并发，可以切换到 PostgreSQL。

### Q: 数据库文件会丢失吗？
A: 数据存储在 `server/data/puzzle-game.db` 文件中，建议定期备份。如果文件丢失，所有用户数据会丢失。

### Q: 如何切换到 PostgreSQL？
A: 项目已集成 Drizzle ORM，只需修改 `server/src/storage/database/sqlite/db.ts` 中的连接配置即可。

### Q: 如何查看数据库日志？
A: SQLite 没有日志，但可以通过 NestJS 日志查看数据库操作：
```bash
tail -f /tmp/coze-logs/dev.log
```

---

## 📚 相关文档

- [Supabase 配置指南](server/SUPABASE_SETUP.md)
- [5分钟快速配置](SUPABASE_5MIN_SETUP.md)
- [Drizzle ORM 文档](https://orm.drizzle.team/)

---

## 🎉 开始使用

**无需任何配置，直接启动项目即可！**

```bash
pnpm dev
```

排行榜功能已经可用，前端会自动调用后端接口同步数据。
