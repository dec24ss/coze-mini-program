import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import express from 'express';

let app: any;

async function bootstrap() {
  if (!app) {
    const expressApp = express();
    const nestApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );

    nestApp.enableCors({
      origin: true,
      credentials: true,
    });
    nestApp.setGlobalPrefix('api');

    // 配置中间件
    nestApp.use(express.json({ limit: '50mb' }));
    nestApp.use(express.urlencoded({ limit: '50mb', extended: true }));

    await nestApp.init();

    app = expressApp;
  }

  return app;
}

// Vercel Serverless Function 导出
export default async function handler(req: any, res: any) {
  const expressApp = await bootstrap();
  expressApp(req, res);
}
