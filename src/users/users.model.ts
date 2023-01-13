/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose'
import { Chat } from 'src/chat/chat.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop(new mongoose.Types.ObjectId())
  _id?: string;

  @Prop()
  socketId?:string

  @Prop()
    name?:string

  @Prop()
  password: string;

  @Prop()
  email: string;

  @Prop()
  lastSeen: string;

  @Prop()
  image: string;

  @Prop()
  room?: string;

  @Prop()
  lastRoom?: string;

@Prop()
chatRooms: Chat[];

}

export const UserSchema = SchemaFactory.createForClass(User);