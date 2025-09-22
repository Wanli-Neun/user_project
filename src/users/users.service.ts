import { Injectable, NotFoundException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../libs/schemas/users.schema';
import { CreateUserDto } from '../libs/dto/users/create-user.dto';
import { UpdateUserDto } from 'src/libs/dto/users/update-user.dto';
import { plainToInstance } from 'class-transformer';
import { ResponseUserDto } from 'src/libs/dto/users/response-user.dto';


@Injectable()
export class UsersService {

    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>){}

    async findAll(): Promise<ResponseUserDto[]>{
        const users = await this.userModel.find().exec();

        return plainToInstance(ResponseUserDto, users.map(u => u.toObject()), { excludeExtraneousValues: true });
    }

    async findOne(id: string){
        const user = await this.userModel.findById(id).exec();
        if (!user){
            throw new NotFoundException('User not found');
        }
        return plainToInstance(ResponseUserDto, user.toObject(), { excludeExtraneousValues: true });

    }

    async create(createUserDto: CreateUserDto): Promise<ResponseUserDto>{
        const newUser = new this.userModel(createUserDto);
        await newUser.save();

        return plainToInstance(ResponseUserDto, newUser.toObject(), { excludeExtraneousValues: true });

    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<ResponseUserDto> {
        const updatedUser = await this.userModel.findById(id).exec();

        if (!updatedUser) {
            throw new NotFoundException(`User not found`);
        }
        updatedUser.set(updateUserDto);
        await updatedUser.save();

        return plainToInstance(ResponseUserDto, updatedUser.toObject(), { excludeExtraneousValues: true });
    }

    async remove(id: string): Promise<ResponseUserDto> {
        const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
        if (!deletedUser) {
            throw new NotFoundException(`User not found`);
        }
        return plainToInstance(ResponseUserDto, deletedUser.toObject(), { excludeExtraneousValues: true });
    }

}
