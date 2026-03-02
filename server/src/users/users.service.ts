import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { S3Storage } from 'coze-coding-dev-sdk';

// 初始化 S3Storage
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
    const client = getSupabaseClient();

    // 先查询用户是否存在
    const { data: existingUsers, error: queryError } = await client
      .from('users')
      .select('*')
      .eq('openid', openid)
      .limit(1);

    if (queryError) {
      console.error('查询用户失败:', queryError);
      throw new Error('查询用户失败');
    }

    // 如果用户存在，检查是否需要更新头像和昵称
    if (existingUsers && existingUsers.length > 0) {
      const existingUser = existingUsers[0];
      let needUpdate = false;
      const updateData: Partial<UserData> = {};

      // 如果传入了新的昵称，且与现有昵称不同，则更新
      if (userData?.nickname && userData.nickname !== existingUser.nickname) {
        updateData.nickname = userData.nickname;
        needUpdate = true;
      }

      // 如果传入了新的头像，且与现有头像不同，则更新
      if (userData?.avatar_url && userData.avatar_url !== existingUser.avatar_url) {
        updateData.avatar_url = userData.avatar_url;
        needUpdate = true;
      }

      // 如果需要更新，执行更新操作
      if (needUpdate) {
        const updatedUser = await this.updateUser(openid, updateData);
        console.log('用户信息已更新:', updateData);
        return updatedUser;
      }

      // 不需要更新，返回现有用户数据
      return existingUser;
    }

    // 用户不存在，创建新用户
    const { data: newUsers, error: insertError } = await client
      .from('users')
      .insert({
        openid,
        nickname: userData?.nickname || '匿名用户',
        avatar_url: userData?.avatar_url || '',
        highest_level: userData?.highest_level || 0,
        points: userData?.points || 0,
      })
      .select()
      .limit(1);

    if (insertError) {
      console.error('创建用户失败:', insertError);
      throw new Error('创建用户失败');
    }

    console.log('创建新用户:', newUsers?.[0]);
    return newUsers?.[0];
  }

  // 更新用户数据
  async updateUser(openid: string, userData: Partial<UserData>) {
    const client = getSupabaseClient();

    const { data: updatedUsers, error } = await client
      .from('users')
      .update({
        nickname: userData.nickname,
        avatar_url: userData.avatar_url,
        highest_level: userData.highest_level,
        points: userData.points,
        updated_at: new Date().toISOString(),
      })
      .eq('openid', openid)
      .select()
      .limit(1);

    if (error) {
      console.error('更新用户失败:', error);
      throw new Error('更新用户失败');
    }

    return updatedUsers?.[0];
  }

  // 获取用户数据
  async getUser(openid: string) {
    const client = getSupabaseClient();

    const { data, error } = await client
      .from('users')
      .select('*')
      .eq('openid', openid)
      .limit(1);

    if (error) {
      console.error('获取用户失败:', error);
      throw new Error('获取用户失败');
    }

    return data && data.length > 0 ? data[0] : null;
  }

  // 获取排行榜（按最高关卡排序）
  async getRankList(limit: number = 10) {
    const client = getSupabaseClient();

    const { data: rankList, error } = await client
      .from('users')
      .select('openid, nickname, avatar_url, highest_level, points')
      .order('highest_level', { ascending: false })
      .order('points', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('获取排行榜失败:', error);
      throw new Error('获取排行榜失败');
    }

    return rankList || [];
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
      console.log(`开始上传头像: ${fileName}, 大小: ${fileBuffer.length} bytes`);

      // 上传文件到对象存储
      const fileKey = await storage.uploadFile({
        fileContent: fileBuffer,
        fileName: `avatars/${openid}_${fileName}`,
        contentType: 'image/jpeg',
      });

      console.log(`头像上传成功，fileKey: ${fileKey}`);

      // 生成签名 URL（有效期 30 天）
      const avatarUrl = await storage.generatePresignedUrl({
        key: fileKey,
        expireTime: 2592000, // 30 天
      });

      console.log(`头像 URL 生成成功: ${avatarUrl}`);

      // 更新用户的头像 URL
      await this.updateUser(openid, { avatar_url: avatarUrl });

      console.log(`用户头像已更新: openid=${openid}`);

      return avatarUrl;
    } catch (error) {
      console.error('上传头像失败:', error);
      throw new Error('上传头像失败');
    }
  }
}
