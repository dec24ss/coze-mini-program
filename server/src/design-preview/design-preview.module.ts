import { Module } from '@nestjs/common';
import { DesignPreviewController } from './design-preview.controller';
import { DesignPreviewService } from './design-preview.service';

@Module({
  controllers: [DesignPreviewController],
  providers: [DesignPreviewService],
  exports: [DesignPreviewService],
})
export class DesignPreviewModule {}
