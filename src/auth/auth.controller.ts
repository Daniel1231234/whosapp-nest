/* eslint-disable prettier/prettier */
import { Controller, Request, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
// import { AuthGuard } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService, private usersService: UsersService) { }

    
    // @UseGuards(AuthGuard('local'))
    @Post('/login')
    async login(@Request() req) {
        const user = await this.usersService.getByUsername(req.body.email)
        if (!user) return
        console.log(user)
        return this.authService.login(user);
    }
}