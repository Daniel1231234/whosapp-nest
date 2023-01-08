/* eslint-disable prettier/prettier */
import { Controller, Get,  Param, Post, Body, Put, Delete } from '@nestjs/common';
import { Chat } from './chat.schema';
import { ChatService } from './chat.service';
// import * as mongoose from 'mongoose'

@Controller('chats')
export class ChatController {
    constructor(private readonly chatService: ChatService) { }
    
    @Post('/')
    async createChat(@Body() chat: Chat): Promise<Chat> {
      const newRoom = await this.chatService.create(chat)
      return newRoom
      }

//   @Get('/')
//   async findAllChat(): Promise<Chat[]> {
//     const res = await this.chatService.findAll();
//     return res
//     }
    
  @Get('/:userId')
  async findUserChat(@Param('userId') userId: string): Promise<Chat[]> {
      console.log(userId);

    const res = await this.chatService.findUserChats(userId);
    return res
  }

  @Get('/:roomId')
  async findOneChat(@Param('roomId') roomId: string): Promise<Chat | any> {
    const res = await this.chatService.findOne(roomId)
    // console.log(res, 'res form chat controller')
    return res
  }

  @Put('/:roomId')
  async updateChat(@Body() chat: Chat): Promise<void> {
    // console.log(chat, ' chat from Put roomid')
    await this.chatService.update(chat._id, chat)
  }

  @Delete('/:roomId')
  async deleteChat(@Param('roomId') roomId: string): Promise<void> {
    // console.log(roomId);
    
    await this.chatService.delete(roomId)
  }
}