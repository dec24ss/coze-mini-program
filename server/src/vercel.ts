import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { Server } from 'http';
import * as express from 'express';

let cachedServer: Server;

async function bootstrap() {
  if (!cachedServer) {
    const expressApp = express();
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );

    app.enableCors({
      origin: true,
      credentials: true,
    });
    app.setGlobalPrefix('api');

    // 配置中间件
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ limit: '50mb', extended: true }));

    await app.init();

    cachedServer = expressApp as any;
  }

  return cachedServer;
}

// Vercel Serverless Function 导出
export default async (req: any, res: any) => {
  const app = await bootstrap();
  app(req, res);
};
