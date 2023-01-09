/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
// import { join } from 'path';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { join } from 'path';

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
        origin: ['http://127.0.0.1:5173', 'https://whosapp.onrender.com'],
        methods: ['GET', 'POST'],
      },
    });
    return server;
  }
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: ['http://127.0.0.1:5173', 'https://whosapp.onrender.com']
  });

  app.useWebSocketAdapter(new SocketAdapter(app));
  app.useStaticAssets(join(__dirname, '..', 'client'));
  const port = process.env.PORT || 3001
    
  await app.listen(port);
  app.getUrl().then((url) => console.log(url))
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap()







