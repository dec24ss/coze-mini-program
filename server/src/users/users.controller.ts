import { Controller, Post, Get, Body, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsersService, UserData } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { realtimeService } from '@/storage/database/realtime-service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 登录/获取用户信息
  @Post('login')
  async login(@Body() body: { openid: string; nickname?: string; avatar_url?: string }) {
    const user = await this.usersService.getOrCreateUser(body.openid, {
      openid: body.openid,
      nickname: body.nickname,
      avatar_url: body.avatar_url,
    });
    return { code: 200, msg: 'success', data: user };
  }

  // 更新用户数据
  @Post('update')
  async updateUser(@Body() body: UserData) {
    const user = await this.usersService.updateUser(body.openid, body);
    return { code: 200, msg: 'success', data: user };
  }

  // 更新最高关卡
  @Post('update-level')
  async updateLevel(@Body() body: { openid: string; highest_level: number }) {
    const user = await this.usersService.updateUser(body.openid, {
      highest_level: body.highest_level,
    });
    return { code: 200, msg: 'success', data: user };
  }

  // 添加积分
  @Post('add-points')
  async addPoints(@Body() body: { openid: string; points: number }) {
    const user = await this.usersService.addPoints(body.openid, body.points);
    return { code: 200, msg: 'success', data: user };
  }

  // 使用积分
  @Post('consume-points')
  async consumePoints(@Body() body: { openid: string; points: number }) {
    const result = await this.usersService.consumePoints(body.openid, body.points);
    return { code: 200, msg: 'success', data: result };
  }

  // 获取排行榜（前100名）
  @Get('rank/list')
  async getRankList() {
    const list = await this.usersService.getRankList(100);
    // 添加排名
    const rankedList = list.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
    return { code: 200, msg: 'success', data: rankedList };
  }

  // 上传头像
  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { openid: string; fileName?: string },
  ) {
    if (!file) {
      return { code: 400, msg: '文件不能为空', data: null };
    }

    if (!body.openid) {
      return { code: 400, msg: 'openid 不能为空', data: null };
    }

    try {
      const avatarUrl = await this.usersService.uploadAvatar(
        file.buffer,
        body.fileName || file.originalname || 'avatar.jpg',
        body.openid,
      );

      return { code: 200, msg: 'success', data: { avatarUrl } };
    } catch (error) {
      console.error('上传头像失败:', error);
      return { code: 500, msg: '上传头像失败', data: null };
    }
  }

  // 备份用户数据
  @Get('backup')
  async backupUsers() {
    try {
      const data = await this.usersService.backupUsers();
      return { code: 200, msg: 'success', data: data };
    } catch (error) {
      console.error('备份用户数据失败:', error);
      return { code: 500, msg: '备份用户数据失败', data: null };
    }
  }

  // 测试实时订阅（用于调试）
  @Get('test-realtime')
  async testRealtime() {
    try {
      const channelName = realtimeService.subscribeToRankList((payload) => {
        console.log('实时订阅回调:', payload);
      });

      return {
        code: 200,
        msg: '实时订阅已启动',
        data: { channelName }
      };
    } catch (error) {
      console.error('启动实时订阅失败:', error);
      return { code: 500, msg: '启动实时订阅失败', data: null };
    }
  }

  // 取消实时订阅（用于调试）
  @Post('unsubscribe-realtime')
  async unsubscribeRealtime(@Body() body: { channelName: string }) {
    try {
      realtimeService.unsubscribe(body.channelName);

      return {
        code: 200,
        msg: '实时订阅已取消',
        data: null
      };
    } catch (error) {
      console.error('取消实时订阅失败:', error);
      return { code: 500, msg: '取消实时订阅失败', data: null };
    }
  }

  // 获取用户信息（必须放在最后，避免与其他路由冲突）
  @Get(':openid')
  async getUser(@Param('openid') openid: string) {
    const user = await this.usersService.getUser(openid);
    if (!user) {
      return { code: 404, msg: '用户不存在', data: null };
    }
    return { code: 200, msg: 'success', data: user };
  }
}
