/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from 'src/message/message.service';
import {  User, UserDocument } from 'src/users/users.model';
// import { Logger } from '@nestjs/common';
import { ChatService } from './chat.service';


@WebSocketGateway({
  namespace: '/chat',
})

@Injectable()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(@InjectModel('chat') private chatService: ChatService, private messageService: MessageService) { }
  @WebSocketServer()
  server: Server;
  // private logger: Logger = new Logger('ChatGateway-logger');
  joinUsers: User[] = [];
  
  async handleConnection(client: Socket) {
    console.log(`user connected ${client.id}`);
    //   const totalChats = await this.chatService.findAll()
    // client.emit('total_chats', totalChats)
  }

  async handleDisconnect(client: Socket) {
    console.log(`user disconnected ${client.id}`);
  }







  @SubscribeMessage('delete_room')
  async handleDeleteRoom(client: Socket, roomId: string) {
    const roomToDelete = await this.chatService.delete(roomId)
    client.emit('deleted_room', roomToDelete )
  }

  @SubscribeMessage('join_room')
  async handleRoomJoin(client: Socket, user: UserDocument) {
    if (this.joinUsers.length > 2 && this.joinUsers.find((u) => u._id === user._id)) return
      client.join(user.room);
      this.joinUsers.push(user);
      client.emit('chatroom_users', this.joinUsers)
      client.to(user.room).emit('chatroom_users', this.joinUsers)

    
    const lastMsgs = await this.messageService.findRoomMsg(user.room)
    client.emit('last_msgs', lastMsgs)

    const createdAt = Date.now();
    client.broadcast.to(user.room).emit('receive_message', {
      txt: `${user.name} has joined the room`,
      sender: 'ChatBot',
      createdAt,
    });
    
    client.emit('receive_message', {
      _id: Date.now().toString(),
      txt: `Welcome ${user.name}`,
      sender: 'ChatBot',
      createdAt: Date.now(),
      room:user.room,
    });
  }

  @SubscribeMessage('remove_message')
  async handleDelete(client: Socket, _id: string) {
    await this.messageService.delete(_id)
  }


  @SubscribeMessage('send_message')
 async handleMessage(
    client: Socket,
    message: {
      sender: string;
      room: string;
      txt: string;
      // createdAt: string;
    },
  ) {
  
    const newMsg = await this.messageService.create(message)    
    this.server.to(message.room).emit('receive_message', newMsg);
  }

  @SubscribeMessage('leave_room')
 async  handleLeaveRoom(
    client: Socket,
    user: UserDocument,
  ) {
   const updatedJoinedUsers =  this.joinUsers.filter((usr) => usr._id !== user._id)
    this.joinUsers = updatedJoinedUsers
    client.to(user.lastRoom).emit('chatroom_users', this.joinUsers)
    const createdAt = Date.now();
    client.to(user.lastRoom).emit('receive_message', {
      sender: 'ChatBot',
      txt: `${user.name} has left the chat`,
      createdAt,
    });

    client.leave(user.lastRoom)
  }
}
