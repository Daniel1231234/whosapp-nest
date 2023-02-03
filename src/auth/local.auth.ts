import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    // console.log(username, password);
    try {
      const user = await this.authService.validateUser(username, password);
      
      if (!user) {
        throw new UnauthorizedException();
      }
      return user;
    } catch (err) {
    console.log(err)
    }
  }
}