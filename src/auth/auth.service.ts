/* eslint-disable prettier/prettier */
import { Injectable, NotAcceptableException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService, private jwtService: JwtService) { }
    
    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.usersService.getByUsername( username );
        console.log(user, ' auth.service');
        
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
    async login(user: any) {
        console.log('user => ', user)
        
        const payload = { username: user?.email, sub: user._id };
        console.log(payload, ' payload');
        
        return {
            access_token: this.jwtService.sign(payload),
            user
        };
    }
}