/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User, UserDocument } from './users.model';

@Injectable()
export class UsersService {
    constructor(@InjectModel('user') private readonly userModel: Model<UserDocument>) { }
    
    async createUser(email: string, password: string, name: string, publicChatroom:any): Promise<User> {
        return this.userModel.create({
            _id: new mongoose.Types.ObjectId(),
            socketId:'',
            lastSeen: Date.now(),
            image: '',
            email,
            password,
            name,
            chatRooms:[publicChatroom]
        })
    }


    async getUser(query: object): Promise<User> {
        return this.userModel.findOne(query)
    }

    async getByUsername(username: string): Promise<any> {
        const users = await this.userModel.find().exec()
        const userToReturn = users.find((user) => user.email === username)
        return userToReturn
    }

    async updateUser(user:User): Promise<User> {
        console.log(user, ' user from user service')
        const updated = { ...user }
        delete updated._id
        return await this.userModel.findOneAndUpdate({ email: updated.email }, updated, {new:true});
    }
}
