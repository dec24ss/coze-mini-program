import { Controller, Get } from '@nestjs/common';
import { ImageService } from './image.service';

@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  /**
   * 获取所有图片列表
   */
  @Get('list')
  getAllImages() {
    const images = this.imageService.getAllImages()
    return {
      code: 200,
      msg: 'success',
      data: {
        images,
        total: images.length
      }
    }
  }

  /**
   * 获取随机图片列表
   * 每次返回100张全新的随机图片（对应100个关卡，使用时间戳作为随机种子）
   * 返回图片版本号，用于支持增量更新
   */
  @Get('random')
  getRandomImages() {
    const images = this.imageService.getRandomImages(100) // 返回100张随机图片
    const version = this.imageService.getImageVersion() // 获取图片版本号
    return {
      code: 200,
      msg: 'success',
      data: {
        images,
        total: images.length,
        version // 返回版本号
      }
    }
  }
}
