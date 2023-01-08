/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { MessageModule } from './message/message.module';

const connectionString = process.env.NODE_ENV === 'production'
  ? 'mongodb+srv://ndh:ndhndh@cluster0.t7f0r.mongodb.net/?retryWrites=true&w=majority'
  : 'mongodb://localhost:27017/whosapp_db';

@Module({
  imports: [
    MongooseModule.forRoot(connectionString),
    UsersModule,
    AuthModule,
    ChatModule,
    MessageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}