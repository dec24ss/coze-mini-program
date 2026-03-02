import { getSupabaseClient } from '@/storage/database/supabase-client';

// 实时订阅服务
export class RealtimeService {
  private static instance: RealtimeService;
  private subscriptions: Map<string, any> = new Map();

  private constructor() {}

  static getInstance(): RealtimeService {
    if (!RealtimeService.instance) {
      RealtimeService.instance = new RealtimeService();
    }
    return RealtimeService.instance;
  }

  // 订阅排行榜变化
  subscribeToRankList(callback: (data: any) => void): string {
    const client = getSupabaseClient();
    const channelName = 'rank-list';

    const channel = client
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',  // 监听所有变化：INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'users',
        },
        (payload) => {
          console.log('排行榜数据已更新:', payload);
          callback(payload);
        }
      )
      .subscribe((status) => {
        console.log(`排行榜订阅状态: ${status}`);
      });

    this.subscriptions.set(channelName, channel);

    return channelName;
  }

  // 取消订阅
  unsubscribe(channelName: string): void {
    const channel = this.subscriptions.get(channelName);
    if (channel) {
      channel.unsubscribe();
      this.subscriptions.delete(channelName);
      console.log(`已取消订阅: ${channelName}`);
    }
  }

  // 取消所有订阅
  unsubscribeAll(): void {
    this.subscriptions.forEach((channel, name) => {
      channel.unsubscribe();
      console.log(`已取消订阅: ${name}`);
    });
    this.subscriptions.clear();
  }
}

// 导出单例实例
export const realtimeService = RealtimeService.getInstance();
