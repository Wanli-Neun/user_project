import { Injectable, NotFoundException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../libs/schemas/users.schema';
import { CreateUserDto } from '../libs/dto/users/create-user.dto';
import { UpdateUserDto } from 'src/libs/dto/users/update-user.dto';
import { plainToInstance } from 'class-transformer';
import { ResponseUserDto } from 'src/libs/dto/users/response-user.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsersService {

    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>){}

    async findAll(): Promise<UserDocument[]>{
        return await this.userModel.find().exec();
    }

    async findOne(id: string): Promise<UserDocument>{
        const user = await this.userModel.findById(id).exec();
        if (!user){
            throw new NotFoundException('User not found');
        }
        return user;

    }

    async create(createUserDto: CreateUserDto): Promise<UserDocument>{
        const newUser = new this.userModel(createUserDto);
        await newUser.save();

        return newUser;

    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
        const updatedUser = await this.userModel.findById(id).exec();

        if (!updatedUser) {
            throw new NotFoundException(`User not found`);
        }
        updatedUser.set(updateUserDto);
        await updatedUser.save();

        return updatedUser;
    }

    async remove(id: string): Promise<UserDocument> {
        const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
        if (!deletedUser) {
            throw new NotFoundException(`User not found`);
        }
        return deletedUser;
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return await this.userModel.findOne({ email }).exec();
    }

    async validatePassword(user: UserDocument, password: string): Promise<boolean> {
        return await bcrypt.compare(password, user.password);
    }

}
