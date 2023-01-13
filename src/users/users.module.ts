/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from "@nestjs/mongoose"
import { UserSchema } from "./users.model"
import { ChatSchema } from 'src/chat/chat.schema';
import { ChatService } from 'src/chat/chat.service';

@Module({
  imports: [MongooseModule.forFeature([
    { name: "user", schema: UserSchema },
    { name: "chat", schema: ChatSchema },
  ])],
  providers: [UsersService, ChatService],
  controllers: [UsersController]
})
export class UsersModule {}
