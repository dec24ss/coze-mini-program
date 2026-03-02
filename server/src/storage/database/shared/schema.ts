import { pgTable, serial, timestamp, text, integer } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const healthCheck = pgTable("health_check", {
	id: serial().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// 用户数据表
export const users = pgTable("users", {
	id: serial().primaryKey(),
	openid: text().notNull().unique(),
	nickname: text(),
	avatarUrl: text("avatar_url"),
	highestLevel: integer("highest_level").default(0),
	points: integer().default(0),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});
