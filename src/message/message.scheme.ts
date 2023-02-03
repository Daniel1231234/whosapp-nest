import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {  Document } from 'mongoose';
import * as mongoose from 'mongoose'


export type MessageDocument = Message & Document;

@Schema()
export class Message {
  @Prop(new mongoose.Types.ObjectId())
  _id?: string

  @Prop()
  sender?: string
  
  @Prop()
  room: string;
    
  @Prop()
  txt:string
    
  @Prop()
  createdAt?: string 

}

export const MessageSchema = SchemaFactory.createForClass(Message);
