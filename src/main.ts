/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';

export class SocketAdapter extends IoAdapter {
  createIOServer(
    port: number,
    options?: ServerOptions & {
      namespace?: string;
      server?: any;
    },
  ) {
    const server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: 'http://127.0.0.1:5173',
        methods: ['GET', 'POST'],
      },
    });
    return server;
  }
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
 app.useStaticAssets(join(__dirname, 'client')); 
  // app.useStaticAssets(join(__dirname, '..', 'static'));
  app.enableCors({
    origin: 'http://127.0.0.1:5173',
  });
  app.useWebSocketAdapter(new SocketAdapter(app));
  await app.listen(3001);
}
bootstrap()