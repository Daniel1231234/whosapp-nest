import { Module } from "@nestjs/common"
import { UsersModule } from "src/users/users.module";
import { AuthService } from "./auth.service"
import { PassportModule } from "@nestjs/passport"
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { UsersService } from "src/users/users.service";
import { MongooseModule } from "@nestjs/mongoose"
import { UserSchema } from "../users/users.model"
// import { LocalStrategy } from './local.auth';
import { ChatSchema } from "src/chat/chat.schema";
import { ChatService } from "src/chat/chat.service";
import { JwtStrategy } from "./jwt-strategy";



@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (): JwtModuleOptions => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: process.env.JWT_EXPIRES_IN,
        },
      }),
    }),
    MongooseModule.forFeature([{ name: "user", schema: UserSchema }, { name: "chat", schema: ChatSchema }])],
  providers: [AuthService, UsersService, ChatService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule { }


// @Module({
//   imports: [UsersModule, PassportModule, JwtModule.register({
//     secret: 'secretKey',
//     signOptions: { expiresIn: '6d' },
//   }), MongooseModule.forFeature([{ name: "user", schema: UserSchema }, { name: "chat", schema: ChatSchema }])],
//   providers: [AuthService, UsersService, LocalStrategy, ChatService],
//   controllers: [AuthController],
// })
// export class AuthModule { }
