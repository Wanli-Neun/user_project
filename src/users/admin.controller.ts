import { Controller, Get, Post, Put, Delete, Param, Body, UseInterceptors, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from 'src/libs/dto/users/create-user.dto';
import { UpdateUserDto } from 'src/libs/dto/users/update-user.dto';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { NormalizeInterceptor } from 'src/libs/interceptors/normalize.interceptor';
import { Roles } from 'src/libs/decorators/role.decorator';
import { RolesGuard } from 'src/libs/guards/roles.guard';
import { plainToInstance } from 'class-transformer';
import { ResponseUserDto } from 'src/libs/dto/users/response-user.dto';
import { AuthGuard } from '@nestjs/passport';



@UseGuards(AuthGuard('jwt'), RolesGuard)
@UseInterceptors(NormalizeInterceptor)
@UseInterceptors(ClassSerializerInterceptor)
@Roles('admin')
@Controller('admin/users')
export class AdminController {

    constructor(private readonly usersService: UsersService){}

    @Get()
    async findAll(): Promise<ResponseUserDto[]> {
        const users = await this.usersService.findAll();
        return plainToInstance(ResponseUserDto, users.map(u => u.toObject()), { excludeExtraneousValues: true });
    }

    @Get(':id')
    async findOne(@Param('id')id: string): Promise<ResponseUserDto>{
        const user = await this.usersService.findOne(id);
        
        return plainToInstance(ResponseUserDto, user.toObject(), { excludeExtraneousValues: true });
    }

    @Post()
    async create(@Body() createUserDto: CreateUserDto): Promise<ResponseUserDto>{
        const newUser = await this.usersService.create(createUserDto);
        return plainToInstance(ResponseUserDto, newUser.toObject(), { excludeExtraneousValues: true });
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<ResponseUserDto>{
        const updatedUser = await this.usersService.update(id, updateUserDto);
        return plainToInstance(ResponseUserDto, updatedUser.toObject(), { excludeExtraneousValues: true });
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<ResponseUserDto>{
        const deletedUser = await this.usersService.remove(id);
        return plainToInstance(ResponseUserDto, deletedUser.toObject(), { excludeExtraneousValues: true });
    }
}