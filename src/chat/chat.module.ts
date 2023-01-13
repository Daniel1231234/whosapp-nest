/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageSchema } from 'src/message/message.scheme';
import { MessageService } from 'src/message/message.service';
import { UserSchema } from 'src/users/users.model';
import { UsersService } from 'src/users/users.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { ChatSchema } from './chat.schema';
import { ChatService } from './chat.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'chat', schema: ChatSchema },
      { name: 'user', schema: UserSchema },
      { name: 'message', schema: MessageSchema },  // Provide the messageModel provider
    ]),
  ],
  providers: [ChatGateway, ChatService, MessageService, UsersService],
  controllers: [ChatController]
})
export class ChatModule {}

