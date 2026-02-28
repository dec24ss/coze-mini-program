import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { UsersService, UserData } from './users.service';

@Controller('api/users')
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

  // 获取排行榜
  @Get('rank/list')
  async getRankList() {
    const list = await this.usersService.getRankList(10);
    // 添加排名
    const rankedList = list.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
    return { code: 200, msg: 'success', data: rankedList };
  }
}
