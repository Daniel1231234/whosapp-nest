import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Hash } from 'src/auth/Hah';
// import { Chat } from 'src/chat/chat.schema';
import { User, UserDocument } from './users.model';

@Injectable()
export class UsersService {
    constructor(@InjectModel('user') private readonly userModel: Model<UserDocument>) { }
    
    async createUser(email: string, password: string, name: string, publicChatroom: any): Promise<User | any> {
        const foundUser = await this.getByEmail(email)
        if (foundUser) throw new ConflictException('Email already in use');
        
        const passwordHash = Hash.generateHash(password)
        return this.userModel.create({
            _id: new mongoose.Types.ObjectId(),
            lastSeen: Date.now(),
            room: '',
            lastRoom:'',
            image: '',
            email,
            password: passwordHash,
            name,
            chatRooms:[publicChatroom]
        })
    }


    async getUser(query: object): Promise<User> {
        return this.userModel.findOne(query)
    }



    async getByEmail(email: string): Promise<any> {
        const users = await this.userModel.find().exec()
        const userToReturn = users.find((user) => user.email === email)
        return userToReturn
    }

    async updateUser(user:User): Promise<User> {
        console.log(user, ' user from user service')
        const updated = { ...user }
        delete updated._id
        return await this.userModel.findOneAndUpdate({ email: updated.email }, updated, {new:true});
    }

        async updateById(user: User): Promise<User | any> {
            const mongoId = new mongoose.Types.ObjectId(user._id)
            delete user._id;
            return await this.userModel.findByIdAndUpdate(mongoId, user, { new: true })
        }
}
