import { Injectable } from '@nestjs/common';
import { db } from '@/storage/database/sqlite/db';
import { users } from '@/storage/database/sqlite/schema';
import { eq, desc } from 'drizzle-orm';

export interface UserData {
  openid: string;
  nickname?: string;
  avatar_url?: string;
  highest_level?: number;
  points?: number;
}

@Injectable()
export class UsersService {
  // 获取或创建用户
  async getOrCreateUser(openid: string, userData?: Partial<UserData>) {
    // 先查询用户是否存在
    const existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.openid, openid))
      .limit(1);

    // 如果用户存在，检查是否需要更新头像和昵称
    if (existingUsers.length > 0) {
      const existingUser = existingUsers[0];
      let needUpdate = false;
      const updateData: Partial<UserData> = {};

      // 如果传入了新的昵称，且与现有昵称不同，则更新
      if (userData?.nickname && userData.nickname !== existingUser.nickname) {
        updateData.nickname = userData.nickname;
        needUpdate = true;
      }

      // 如果传入了新的头像，且与现有头像不同，则更新
      if (userData?.avatar_url && userData.avatar_url !== existingUser.avatarUrl) {
        updateData.avatar_url = userData.avatar_url;
        needUpdate = true;
      }

      // 如果需要更新，执行更新操作
      if (needUpdate) {
        const updatedUsers = await this.updateUser(openid, updateData);
        console.log('用户信息已更新:', updateData);
        return updatedUsers;
      }

      // 不需要更新，返回现有用户数据
      return existingUser;
    }

    // 用户不存在，创建新用户
    const newUsers = await db
      .insert(users)
      .values({
        openid,
        nickname: userData?.nickname || '匿名用户',
        avatarUrl: userData?.avatar_url || '',
        highestLevel: userData?.highest_level || 0,
        points: userData?.points || 0,
      })
      .returning();

    console.log('创建新用户:', newUsers[0]);
    return newUsers[0];
  }

  // 更新用户数据
  async updateUser(openid: string, userData: Partial<UserData>) {
    const updatedUsers = await db
      .update(users)
      .set({
        nickname: userData.nickname,
        avatarUrl: userData.avatar_url,
        highestLevel: userData.highest_level,
        points: userData.points,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(users.openid, openid))
      .returning();

    return updatedUsers[0];
  }

  // 获取用户数据
  async getUser(openid: string) {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.openid, openid))
      .limit(1);

    return result.length > 0 ? result[0] : null;
  }

  // 获取排行榜（按最高关卡排序）
  async getRankList(limit: number = 10) {
    const rankList = await db
      .select({
        openid: users.openid,
        nickname: users.nickname,
        avatar_url: users.avatarUrl,
        highest_level: users.highestLevel,
        points: users.points,
      })
      .from(users)
      .orderBy(desc(users.highestLevel), desc(users.points))
      .limit(limit);

    return rankList;
  }

  // 添加积分
  async addPoints(openid: string, points: number) {
    const user = await this.getUser(openid);
    if (!user) {
      throw new Error('用户不存在');
    }

    const newPoints = (user.points || 0) + points;
    return this.updateUser(openid, { points: newPoints });
  }

  // 使用积分
  async consumePoints(openid: string, points: number) {
    const user = await this.getUser(openid);
    if (!user) {
      throw new Error('用户不存在');
    }

    if ((user.points || 0) < points) {
      return { success: false, message: '积分不足' };
    }

    const newPoints = (user.points || 0) - points;
    await this.updateUser(openid, { points: newPoints });
    return { success: true, points: newPoints };
  }
}
