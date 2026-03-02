const Database = require('better-sqlite3');
const { drizzle } = require('drizzle-orm/better-sqlite3');
const schema = require('./schema');
const path = require('path');
const fs = require('fs');

// 数据库文件路径（使用 /tmp 目录确保在生产环境中可写）
const DB_PATH = path.join('/tmp', 'puzzle-game.db');
const DB_DIR = path.dirname(DB_PATH);

// 确保 data 目录存在
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// 创建数据库连接
const sqlite = new Database(DB_PATH);

// 启用外键约束
sqlite.pragma('foreign_keys = ON');

// 创建 Drizzle 实例
export const db = drizzle(sqlite, { schema });

// 数据库初始化函数（创建表）
export async function initDatabase() {
  try {
    console.log('📦 初始化 SQLite 数据库...');
    console.log(`📁 数据库路径: ${DB_PATH}`);

    // 创建 users 表
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        openid TEXT NOT NULL UNIQUE,
        nickname TEXT,
        avatar_url TEXT,
        highest_level INTEGER DEFAULT 0,
        points INTEGER DEFAULT 0,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      );

      CREATE INDEX IF NOT EXISTS idx_users_openid ON users(openid);
      CREATE INDEX IF NOT EXISTS idx_users_highest_level ON users(highest_level DESC);
      CREATE INDEX IF NOT EXISTS idx_users_points ON users(points DESC);
    `);

    console.log('✅ SQLite 数据库初始化成功');
  } catch (error) {
    console.error('❌ SQLite 数据库初始化失败:', error);
    throw error;
  }
}

// 应用启动时初始化数据库
initDatabase().catch(console.error);
