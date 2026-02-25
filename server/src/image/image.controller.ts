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
   * @param count - 返回的图片数量，默认10张
   */
  @Get('random')
  getRandomImages() {
    const images = this.imageService.getRandomImages(10)
    return {
      code: 200,
      msg: 'success',
      data: {
        images,
        total: images.length
      }
    }
  }
}
