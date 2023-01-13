/* eslint-disable prettier/prettier */
import { Body, Controller,  Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.model';
import * as bcrypt from 'bcrypt';
import { ChatService } from 'src/chat/chat.service';

@Controller('/api/users')
export class UsersController {
    constructor(private readonly usersService: UsersService, private readonly chatService: ChatService) { }

    @Post('/signup')
    async createUser(
        @Body('password') password: string,
        @Body('email') email: string,
        @Body('name') name: string,
    ): Promise<User> {
        const saltOrRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltOrRounds);
        const publicChatroom = await this.chatService.getPublicRoom()

        const result = await this.usersService.createUser(
            email,
            hashedPassword,
            name,
            publicChatroom
        );
        return result;
    }

    @Put('/')
    async onUpdateUser(@Body() user: User): Promise<User> {
        console.log(user, ' user from user controller');
        
        const userToUpdate = await this.usersService.updateUser(user)
        console.log(userToUpdate, ' userToUpdate from user controller');
        return userToUpdate
    }

    

}
