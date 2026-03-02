import { Injectable } from '@nestjs/common';
import { db } from '@/storage/database/sqlite/db';
import { users } from '@/storage/database/sqlite/schema';
import { eq, desc } from 'drizzle-orm';
import { S3Storage } from 'coze-coding-dev-sdk';

// 初始化 S3Storage（添加调试日志）
console.log('=== 对象存储配置 ===');
console.log('COZE_BUCKET_ENDPOINT_URL:', process.env.COZE_BUCKET_ENDPOINT_URL);
console.log('COZE_BUCKET_NAME:', process.env.COZE_BUCKET_NAME);
console.log('所有环境变量:', Object.keys(process.env).filter(key => key.includes('BUCKET') || key.includes('STORAGE')));

const storage = new S3Storage({
  endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
  accessKey: "",
  secretKey: "",
  bucketName: process.env.COZE_BUCKET_NAME,
  region: "cn-beijing",
});

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

  // 上传头像到对象存储
  async uploadAvatar(fileBuffer: Buffer, fileName: string, openid: string): Promise<string> {
    try {
      console.log('=== 开始上传头像 ===');
      console.log('openid:', openid);
      console.log('fileName:', fileName);
      console.log('文件大小:', fileBuffer.length, 'bytes');

      // 检查对象存储是否已初始化
      console.log('对象存储端点:', process.env.COZE_BUCKET_ENDPOINT_URL);
      console.log('对象存储桶名:', process.env.COZE_BUCKET_NAME);

      if (!process.env.COZE_BUCKET_ENDPOINT_URL || !process.env.COZE_BUCKET_NAME) {
        throw new Error('对象存储环境变量未配置');
      }

      // 上传文件到对象存储
      console.log('正在上传到对象存储...');
      const fileKey = await storage.uploadFile({
        fileContent: fileBuffer,
        fileName: `avatars/${openid}_${fileName}`,
        contentType: 'image/jpeg',
      });

      console.log('✓ 头像上传成功');
      console.log('fileKey:', fileKey);

      // 生成签名 URL（有效期 30 天）
      console.log('正在生成签名 URL...');
      const avatarUrl = await storage.generatePresignedUrl({
        key: fileKey,
        expireTime: 2592000, // 30 天
      });

      console.log('✓ 头像 URL 生成成功');
      console.log('avatarUrl:', avatarUrl);

      // 更新用户的头像 URL
      console.log('正在更新数据库...');
      await this.updateUser(openid, { avatar_url: avatarUrl });

      console.log('✓ 数据库更新成功');
      console.log('=== 头像上传流程完成 ===');

      return avatarUrl;
    } catch (error) {
      console.error('❌ 上传头像失败');
      console.error('错误类型:', error?.constructor?.name);
      console.error('错误消息:', error?.message);
      console.error('错误堆栈:', error?.stack);
      throw new Error('上传头像失败: ' + error.message);
    }
  }
}
