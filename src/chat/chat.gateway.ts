/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
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
import { UsersService } from 'src/users/users.service';
import { utilService } from 'src/utils/utils';
import { ChatService } from './chat.service';

@WebSocketGateway({
  namespace: '/chat',
  cors:'*',
})

@Injectable()
export class ChatGateway implements   OnGatewayConnection,  OnGatewayDisconnect {
  constructor(@InjectModel('chat')
    private chatService: ChatService,
    private messageService: MessageService,
    private userService: UsersService)
  { }

  
  @WebSocketServer()
  server: Server;
  joinUsers: User[] = [];
  currRoom = ""
  private readonly logger = new Logger('whosapp');
  
  async handleConnection(client: Socket) {
    console.log(`user connected ${client.id}`)
    this.logger.log(`user connected ${client.id}`)
  }

  async handleDisconnect(client: Socket) {
    console.log(`user disconnected ${client.id}`);

    // client.emit('user_left_room', { userId: client.id })
  }

  
  @SubscribeMessage('delete_room')
  async handleDeleteRoom(client: Socket, roomId: string) {
    const roomToDelete = await this.chatService.delete(roomId)
    client.emit('deleted_room', roomToDelete )
  }

  @SubscribeMessage('join_room')
  async handleRoomJoin(client: Socket, user: UserDocument) {
    try {
      const isUserExist = this.joinUsers.find(usr => usr._id === user._id)
      if (!isUserExist) this.joinUsers = utilService.addUserToList(user, this.joinUsers)
        // console.log(this.joinUsers, ' this.joinUsers');
      client.join(user.room);
      this.currRoom = user.room
        client.emit('chatroom_users', this.joinUsers)
        client.to(user.room).emit('chatroom_users', this.joinUsers)
      
      const lastMsgs = await this.messageService.findRoomMsg(user.room)
      client.emit('last_msgs', lastMsgs)
  
      const createdAt = Date.now();
      if (!isUserExist) client.to(user.room).emit('receive_message', {
       _id: utilService.makeId(10),
        txt: `${user.name} has joined the room`,
        sender: 'ChatBot',
        createdAt,
      });
      
      client.emit('receive_message', {
         _id: utilService.makeId(10),
        txt: `Welcome ${user.name}`,
        sender: 'ChatBot',
        createdAt: Date.now(),
        room:user.room,
      });
    } catch (err) {
      console.log(err)
    }
  }

  @SubscribeMessage('remove_message')
  async handleDelete(client: Socket, _id: string) {
    // const lastMsgs = await this.messageService.findRoomMsg(this.currRoom)
    // client.to(this.currRoom).emit('last_msgs', lastMsgs)
    await this.messageService.delete(_id)   
  }


  @SubscribeMessage('send_message')
 async handleMessage(
    client: Socket,
    message: {
      sender: string;
      room: string;
      txt: string;
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
    // console.log('user leave room: ', user);
    this.joinUsers = utilService.removeUserFromList(user._id, this.joinUsers);
    client.emit('chatroom_users', this.joinUsers)
    this.server.to(user.lastRoom).emit('chatroom_users', this.joinUsers)

    const createdAt = Date.now();
    this.server.emit('receive_message', {
       _id: utilService.makeId(10),
      sender: 'ChatBot',
      txt: `${user.name} has left the chat`,
      createdAt,
    });
    
    client.leave(user.lastRoom)
    this.currRoom = ''
  }
}
