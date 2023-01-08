/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User, UserDocument } from './users.model';

@Injectable()
export class UsersService {
    constructor(@InjectModel('user') private readonly userModel: Model<UserDocument>) { }
    
    async createUser(email: string, password: string, name:string): Promise<User> {
        return this.userModel.create({
            _id: new mongoose.Types.ObjectId(),
            lastSeen: Date.now(),
            image: '',
            email,
            password,
            name,
            chatRooms:[]
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

    // async updateUser()
}
