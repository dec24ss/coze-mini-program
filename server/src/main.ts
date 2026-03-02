import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as express from 'express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(),
  );

  // 全局前缀
  app.setGlobalPrefix('api');

  // 启用 CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // 静态文件服务（本地图片）
  try {
    const publicPath = path.join(__dirname, '../public');
    app.use('/api/images', express.static(publicPath));
    console.log('✅ 静态文件服务已启用:', publicPath);
  } catch (error) {
    console.warn('⚠️  静态文件服务配置失败，将使用外部 CDN URL');
    console.warn('⚠️  错误:', (error as Error).message);
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Server is running on: http://localhost:${port}`);
  console.log(`📚 API endpoint: http://localhost:${port}/api`);
}

bootstrap();
