/* eslint-disable prettier/prettier */
import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.model';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post('/signup')
    async createUser(
        @Body('password') password: string,
        @Body('email') email: string,
        @Body('name') name: string,
    ): Promise<User> {
        const saltOrRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltOrRounds);
        const result = await this.usersService.createUser(
            email,
            hashedPassword,
            name
        );
        return result;
    }

@Put('/:userId')
    async update(@Param('userId') userId: string, @Body('chatId') chatId:string):Promise<User | void> {
        console.log(userId, chatId, ' users controllets')
        
    }

}
