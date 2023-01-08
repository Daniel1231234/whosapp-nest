/* eslint-disable prettier/prettier */
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Message } from "./message.scheme";
import * as mongoose from 'mongoose'
import { Injectable } from "@nestjs/common";



@Injectable()
export class MessageService {
  constructor(@InjectModel('message') private  messageModel: Model<Message>) {}

  async create(message: Message): Promise<Message> {
    const { room, sender, txt } = message
    const createdAt = Date.now()
    const newMessage = {
      _id: new mongoose.Types.ObjectId(),
      room,
      sender,
      txt,
      createdAt,
    }
    const updatedMsg = await this.messageModel.create(newMessage)
    // console.log(newRoom, ' newRoom');
    
    return updatedMsg
  }

  async findAll(): Promise<Message[]> {
    return await this.messageModel.find().exec();
  }

  async findRoomMsg(room: string): Promise<Message[]> {
    const allMsgs = await this.messageModel.find().exec();
    const res = allMsgs.filter((msg) => msg.room === room)
    console.log(res, ' total msgs from room')
    return res   
    // return await this.messageModel.findOne({ room: room }).exec();
  }



  async delete(_id:  string): Promise<Message | any> {
    try {
      const objectId = new mongoose.Types.ObjectId(_id);
      const messageToDelete = await this.messageModel.findByIdAndRemove(objectId);
      // console.log(messageToDelete)
      return messageToDelete
    } catch (err) {
      console.log(err);
    }
  }
}
