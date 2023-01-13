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
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });
    return server;
  }
}
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: '*'
  });

  // app.useWebSocketAdapter(new SocketAdapter(app));
  app.useStaticAssets(join(__dirname, '..', 'public'));
  const port = process.env.PORT || 3001
    
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap()