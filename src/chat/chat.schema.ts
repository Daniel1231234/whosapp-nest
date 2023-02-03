import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {  Document } from 'mongoose';
// import { User } from 'src/users/users.model';
import * as mongoose from 'mongoose'
// import { UserDocument } from 'src/users/users.model';

// export type ChatDocument = HydratedDocument<Chat>
export type ChatDocument = Chat & Document;

@Schema()
export class Chat {
  @Prop(new mongoose.Types.ObjectId())
  _id:string
  
  @Prop()
  room: string;
    
  @Prop()
  messages?: Array<any | null>
    
  @Prop()
  users?: Array<any>;
    
  @Prop()
  createdByUserId?: string

}

export const ChatSchema = SchemaFactory.createForClass(Chat);
