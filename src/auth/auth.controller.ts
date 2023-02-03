import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';


@Controller('/api/auth')
export class AuthController {
    constructor(private authService: AuthService, private usersService: UsersService) { }


    @Post('/login')
    async login(
        @Body('email') email: string,
        @Body('password') password: string) {
        const cred = { email, password }
        const res = await this.authService.login(cred);
        console.log(res)
        return res
    }

    @Post('/signup')
    signup(
        @Body('email') email: string,
        @Body('password') password: string,
        @Body('name') name: string) {
        // console.log(email, password, name)

        return this.authService.signup(email, password, name)
    }


}