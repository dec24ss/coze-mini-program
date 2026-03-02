import { Controller, Post, Get, Body, Param, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsersService, UserData } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';

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

  // 获取用户信息
  @Get(':openid')
  async getUser(@Param('openid') openid: string) {
    const user = await this.usersService.getUser(openid);
    if (!user) {
      return { code: 404, msg: '用户不存在', data: null };
    }
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
    console.log('=== 收到头像上传请求 ===');
    console.log('openid:', body.openid);
    console.log('fileName:', body.fileName);
    console.log('file:', file ? '存在' : '不存在');

    if (!file) {
      console.error('文件不能为空');
      return { code: 400, msg: '文件不能为空', data: null };
    }

    if (!body.openid) {
      console.error('openid 不能为空');
      return { code: 400, msg: 'openid 不能为空', data: null };
    }

    console.log('文件信息:');
    console.log('- 原始文件名:', file.originalname);
    console.log('- 文件大小:', file.size, 'bytes');
    console.log('- MIME 类型:', file.mimetype);
    console.log('- Buffer 长度:', file.buffer ? file.buffer.length : 0);

    try {
      console.log('开始调用上传服务...');
      const avatarUrl = await this.usersService.uploadAvatar(
        file.buffer,
        body.fileName || file.originalname || 'avatar.jpg',
        body.openid,
      );

      console.log('✓ 上传成功');
      console.log('返回的 avatarUrl:', avatarUrl);

      return { code: 200, msg: 'success', data: { avatarUrl } };
    } catch (error) {
      console.error('❌ 上传头像失败');
      console.error('错误:', error);
      return { code: 500, msg: '上传头像失败: ' + error.message, data: null };
    }
  }
}
