import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageSchema } from './message.scheme';
import { MessageService } from './message.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'message', schema: MessageSchema }])],
  providers: [MessageService],
  controllers:[]
})
export class MessageModule { }