import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../libs/schemas/users.schema';
import { CreateUserDto } from '../libs/dto/users/create-user.dto';
import { UpdateUserDto } from 'src/libs/dto/users/update-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateProfileDto } from 'src/libs/dto/users/update-profile.dto';


@Injectable()
export class UsersService {

    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>){}

    async findAll(): Promise<UserDocument[]>{
        return await this.userModel.find({ isDeleted: false }).exec();
    }

    async findOne(id: string): Promise<UserDocument>{
        const user = await this.userModel.findOne({ _id: id, isDeleted: false }).exec();
        if (!user){
            throw new NotFoundException('User not found or already deleted');
        }

        return user;
    }

    async create(createUserDto: CreateUserDto): Promise<UserDocument>{
        const existed = await this.userModel.findOne({ email: createUserDto.email, isDeleted: false }).exec();
        if (existed){
            throw new BadRequestException(`Email ${createUserDto.email} already exists`);
        }

        return await new this.userModel(createUserDto).save();
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
        const updatedUser = await this.userModel.findOne({ _id: id, isDeleted: false }).exec();

        if (!updatedUser) {
            throw new NotFoundException(`User not found or already deleted`);
        }
        updatedUser.set(updateUserDto);
        await updatedUser.save();

        return updatedUser;
    }

    async remove(id: string): Promise<UserDocument> {
        const user = await this.userModel.findOne({ _id: id, isDeleted: false }).exec();
        if (!user) {
            throw new NotFoundException(`User not found or already deleted`);
        }
        user.isDeleted = true;

        return await user.save();
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return await this.userModel.findOne({ email, isDeleted: false }).exec();
    }

    async validatePassword(user: UserDocument, password: string): Promise<boolean> {
        return await bcrypt.compare(password, user.password);
    }

    async updateProfile(id: string, updateProfileDto: UpdateProfileDto): Promise<UserDocument> {
        const updatedUser = await this.userModel.findOne({ _id: id, isDeleted: false }).exec();

        if (!updatedUser) {
            throw new NotFoundException(`User not found or already deleted`);
        }

        updatedUser.set(updateProfileDto);
        await updatedUser.save();

        return updatedUser;
    }

    async findPaginated(lastId?: string, limit = 10) {
        const filter = lastId ? { _id: { $gt: lastId } } : {};

        return this.userModel
            .find(filter)
            .sort({ _id: 1 })
            .limit(limit)
            .lean()       
            .exec();
    }


}
