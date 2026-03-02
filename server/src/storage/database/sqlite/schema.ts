import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// 用户数据表（SQLite 版本）
export const users = sqliteTable('users', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  openid: text('openid').notNull().unique(),
  nickname: text('nickname'),
  avatarUrl: text('avatar_url'),
  highestLevel: integer('highest_level').default(0),
  points: integer('points').default(0),
  createdAt: text('created_at').default(sql`datetime('now')`),
  updatedAt: text('updated_at').default(sql`datetime('now')`),
});

// 导出所有表类型
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
