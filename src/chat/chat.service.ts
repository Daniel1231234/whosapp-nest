/* eslint-disable prettier/prettier */
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Chat } from "./chat.schema";
import * as mongoose from 'mongoose'

export class ChatService {
  constructor(@InjectModel('chat') private readonly chatModel: Model<Chat>) {}

  async create(chat: Chat): Promise<Chat> {
    const { room, messages, users, createdByUserId } = chat
    const newChat = {
      _id: new mongoose.Types.ObjectId(),
      room,
      messages,
      users,
      createdByUserId
    }
    const newRoom = await this.chatModel.create(newChat)
    console.log(newRoom, ' newRoom from service');
    
    return newRoom
  }

    async findUserChats(userId:string): Promise<Chat[]> {
    const totalChats = await this.chatModel.find().exec()
    const userChats = totalChats.filter((chat) => chat.createdByUserId === userId)
    return userChats
  }


  async getPublicRoom(): Promise<Chat> {
      return await this.chatModel.findOne({room:'Public room'})
  }

  async findAll(): Promise<Chat[]> {
    return await this.chatModel.find().exec();
  }

  async findOne(roomId: string): Promise<Chat> {
    console.log(roomId, 'FROM SERVIE');
    const id = new mongoose.Types.ObjectId(roomId)
    const chat = await this.chatModel.findOne({ _id: id }).exec();
    return chat
  }

  async update(_id: string, chat: Chat): Promise<Chat> {
    return await this.chatModel.findByIdAndUpdate(_id, chat, { new: true });
  }

  async delete(roomId:  string): Promise<Chat | any> {
    try {
      const objectId = new mongoose.Types.ObjectId(roomId);
      const chatToDelete = await this.chatModel.findByIdAndRemove(objectId);
      // console.log(chatToDelete)
      return chatToDelete
    } catch (err) {
      console.log(err);
    }
  }
}
