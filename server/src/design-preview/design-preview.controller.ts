import { Controller, Post, Body } from '@nestjs/common';
import { DesignPreviewService } from './design-preview.service';

@Controller('design-preview')
export class DesignPreviewController {
  constructor(private readonly designPreviewService: DesignPreviewService) {}

  @Post('generate')
  async generateDesign(@Body() body: { scheme: string }) {
    return await this.designPreviewService.generateDesignPreview(body.scheme);
  }
}
