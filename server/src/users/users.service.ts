import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '@/storage/database/supabase-client';

export interface UserData {
  openid: string;
  nickname?: string;
  avatar_url?: string;
  highest_level?: number;
  points?: number;
}

@Injectable()
export class UsersService {
  private supabase = getSupabaseClient();

  // 获取或创建用户
  async getOrCreateUser(openid: string, userData?: Partial<UserData>) {
    // 先查询用户是否存在
    const { data: existingUser, error: queryError } = await this.supabase
      .from('users')
      .select('*')
      .eq('openid', openid)
      .single();

    if (queryError && queryError.code !== 'PGRST116') {
      console.error('查询用户失败:', queryError);
      throw new Error('查询用户失败');
    }

    // 如果用户存在，返回用户数据
    if (existingUser) {
      return existingUser;
    }

    // 用户不存在，创建新用户
    const { data: newUser, error: insertError } = await this.supabase
      .from('users')
      .insert({
        openid,
        nickname: userData?.nickname || '匿名用户',
        avatar_url: userData?.avatar_url || '',
        highest_level: userData?.highest_level || 0,
        points: userData?.points || 0,
      })
      .select()
      .single();

    if (insertError) {
      console.error('创建用户失败:', insertError);
      throw new Error('创建用户失败');
    }

    return newUser;
  }

  // 更新用户数据
  async updateUser(openid: string, userData: Partial<UserData>) {
    const { data, error } = await this.supabase
      .from('users')
      .update({
        ...userData,
        updated_at: new Date().toISOString(),
      })
      .eq('openid', openid)
      .select()
      .single();

    if (error) {
      console.error('更新用户失败:', error);
      throw new Error('更新用户失败');
    }

    return data;
  }

  // 获取用户数据
  async getUser(openid: string) {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('openid', openid)
      .single();

    if (error) {
      console.error('获取用户失败:', error);
      return null;
    }

    return data;
  }

  // 获取排行榜（按最高关卡排序）
  async getRankList(limit: number = 10) {
    const { data, error } = await this.supabase
      .from('users')
      .select('openid, nickname, avatar_url, highest_level, points')
      .order('highest_level', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('获取排行榜失败:', error);
      throw new Error('获取排行榜失败');
    }

    return data || [];
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
