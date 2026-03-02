import { Module } from '@nestjs/common';
import { ImageModule } from './image/image.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ImageModule,
    UsersModule,
  ],
})
export class AppModule {}
