import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { ImageModule } from '@/image/image.module';
import { UsersModule } from '@/users/users.module';

@Module({
  imports: [ImageModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
