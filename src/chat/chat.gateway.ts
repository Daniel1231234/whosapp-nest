import { Injectable, Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from 'src/message/message.service';
import {  UserDocument } from 'src/users/users.model';
import { UsersService } from 'src/users/users.service';
import { utilService } from 'src/utils/utils';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: { origin: "*" }
})

  
@Injectable()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private chatService: ChatService,
    private messageService: MessageService,
    private userService: UsersService) { }

  @WebSocketServer()
  server: Server;
  private readonly logger = new Logger('whosapp');

  async handleConnection(client: Socket) {
    console.log(`user connected ${client.id}`)


    client.on('join_room', async (user: UserDocument) => {
      const updatedChat = await this.chatService.updateChatWithUsers(user, 'add')
      this.logger.log(`Client joined room: ${updatedChat.room}`)
      client.join(updatedChat.room)
      client.emit('chatroom_users', updatedChat.users)

      this.server.to(user.room).emit('chatroom_users', updatedChat.users)

      const lastMsgs = await this.messageService.findRoomMsg(user.room)
      client.emit('last_msgs', lastMsgs)

      const createdAt = Date.now();
      client.to(user.room).emit('receive_message', {
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
        room: user.room,
      });

    })

    client.on('send_message', async (message: { sender: string, room: string, txt: string }) => {
      const newMsg = await this.messageService.create(message)
      this.server.to(message.room).emit('receive_message', newMsg);
    })

    client.on('leave_room', async (user: UserDocument, leavingRoom: string) => {
      user.room = leavingRoom
      const updatedChat = await this.chatService.updateChatWithUsers(user, 'remove')
      this.logger.log(`Client leave room: ${leavingRoom}`);
      client.emit('chatroom_users', updatedChat.users);
      this.server.to(leavingRoom).emit('chatroom_users', updatedChat.users)

      const createdAt = Date.now()
      this.server.to(leavingRoom).emit('receive_message', {
        _id: utilService.makeId(10),
        sender: 'ChatBot',
        txt: `${user.name} has left the chat`,
        createdAt,
      });

      client.leave(leavingRoom)
    })

    client.on('delete_room', async (roomId: string) => {
      const roomToDelete = await this.chatService.delete(roomId)
      client.emit('deleted_room', roomToDelete)
    })

    client.on('start_typing', (username: string, room: string) => {
      client.to(room).emit('user_typing', username);
    })

    client.on('stop_typing', (room: string) => {
      client.to(room).emit('user_typing', "");
    })

    client.on('remove_message', async (msg:any) => {
      await this.messageService.delete(msg._id)
    })
  }

  async handleDisconnect(client: Socket) {
    console.log(`user disconnected ${client.id}`);
  }









}
