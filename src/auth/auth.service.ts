import { Injectable, NotAcceptableException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { ChatService } from 'src/chat/chat.service';
import { Hash } from './Hah';



@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private jwtService: JwtService,
        private chatService: ChatService) { }
    
    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.usersService.getByEmail( username );
        
        if (!user) return null;
        const passwordValid = await bcrypt.compare(password, user.password)
        if (!user) {
            throw new NotAcceptableException('could not find the user');
        }
        if (user && passwordValid) {
            return user;
        }
        return null;
    }

    async login(cred: { email: string; password: string; }) {    
        const userIsExist = await this.usersService.getByEmail(cred.email)
        if (!userIsExist) throw new UnauthorizedException('Invalid email! or password')
        
        const isPasswordValid = Hash.compare(cred.password, userIsExist.password)
        if (!isPasswordValid) throw new UnauthorizedException('Invalid email or password!')
        


        const token = this.generateToken(userIsExist._id)
        return {userIsExist, token}

    }
    
    async signup(email: string, password: string, name: string) {
        const publicChatroom = await this.chatService.getPublicRoom()
        const user = await this.usersService.createUser(email, password, name, publicChatroom)
        const token = this.generateToken(user._id)
        return {user, token}
    }


    generateToken(userId: any) {
        const payload: {userId:any} = { userId };
        return this.jwtService.sign(payload);
  }

  
}