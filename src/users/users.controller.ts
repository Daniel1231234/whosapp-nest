/* eslint-disable prettier/prettier */
import { Body, Controller,  Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.model';
import { ChatService } from 'src/chat/chat.service';

@Controller('/api/users')
export class UsersController {
    constructor(private readonly usersService: UsersService,
        private readonly chatService: ChatService) { }


    @Put('/')
    async onUpdateUser(@Body() user: User): Promise<User> {
        const userToUpdate = await this.usersService.updateById(user)
        console.log(userToUpdate, ' userToUpdate from user controller');
        return userToUpdate
    }

    

}
