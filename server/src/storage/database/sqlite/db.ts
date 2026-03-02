const Database = require('better-sqlite3');
const { drizzle } = require('drizzle-orm/better-sqlite3');
const schema = require('./schema');
const path = require('path');
const fs = require('fs');

// 数据库文件路径
// 在部署环境（FaaS）中使用 /tmp 目录，在开发环境使用 data 目录
const isFaaS = process.env.FAAS_ENV || !fs.existsSync(path.join(process.cwd(), 'data'));
const DB_DIR = isFaaS ? '/tmp' : path.join(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'puzzle-game.db');

console.log('🔍 检测运行环境:', isFaaS ? 'FaaS 部署环境' : '开发环境');
console.log(`📁 数据库路径: ${DB_PATH}`);

// 确保 data 目录存在（仅在开发环境）
if (!isFaaS && !fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
  console.log(`✅ 已创建目录: ${DB_DIR}`);
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
