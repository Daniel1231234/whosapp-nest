/* eslint-disable prettier/prettier */
import { Controller, Get,  Param, Post, Body, Put, Delete } from '@nestjs/common';
// import { User } from 'src/users/users.model';
import { UsersService } from 'src/users/users.service';
import { Chat } from './chat.schema';
import { ChatService } from './chat.service';
// import * as mongoose from 'mongoose'

@Controller('/api/chats')
export class ChatController {
  constructor(private readonly chatService: ChatService,
    private readonly userService: UsersService) { }
  
  @Post('/')
  async createChat(@Body() chat: Chat): Promise<Chat> {
    const newRoom = await this.chatService.create(chat)
    return newRoom
  }

  @Delete('/')
  async deleteChat(@Body('roomId') roomId: string): Promise<void> {    
    await this.chatService.delete(roomId)
  }

  
  @Get('/:roomId')
  async findOneChat(@Param('roomId') roomId: string): Promise<Chat | any> {
    console.log(roomId, ' roomId from chatcontroller')
    const res = await this.chatService.findOne(roomId)
    return res
  }

  @Put('/:roomId')
  async updateChat(@Body() chat: Chat): Promise<void> {
    await this.chatService.update(chat._id, chat)
  }


}