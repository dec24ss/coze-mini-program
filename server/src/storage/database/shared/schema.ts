import { pgTable, serial, timestamp, unique, pgPolicy, text, integer } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const healthCheck = pgTable("health_check", {
	id: serial().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	openid: text().notNull(),
	nickname: text(),
	avatarUrl: text("avatar_url"),
	highestLevel: integer("highest_level").default(0),
	points: integer().default(0),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	unique("users_openid_unique").on(table.openid),
	pgPolicy("users_允许公开删除", { as: "permissive", for: "delete", to: ["public"], using: sql`true` }),
	pgPolicy("users_允许公开更新", { as: "permissive", for: "update", to: ["public"] }),
	pgPolicy("users_允许公开写入", { as: "permissive", for: "insert", to: ["public"] }),
	pgPolicy("users_允许公开读取", { as: "permissive", for: "select", to: ["public"] }),
]);
