import { Controller, UseInterceptors, UseGuards, Get, Req, Put, Body } from '@nestjs/common';
import { Roles } from 'src/libs/decorators/role.decorator';
import { RolesGuard } from 'src/libs/guards/roles.guard';
import { NormalizeInterceptor } from 'src/libs/interceptors/normalize.interceptor';
import { AuthGuard } from '@nestjs/passport';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ResponseUserDto } from 'src/libs/dto/users/response-user.dto';
import { UsersService } from './users.service';
import { UnauthorizedException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { UpdateProfileDto } from 'src/libs/dto/users/update-profile.dto';


@UseGuards(AuthGuard('jwt'), RolesGuard)
@UseInterceptors(NormalizeInterceptor)
@UseInterceptors(ClassSerializerInterceptor)
@Roles('user')
@Controller('user/profile')
export class ProfileController {

    constructor(private readonly usersService: UsersService) {}

    @Get()
    async getProfile(@Req() req: any): Promise<ResponseUserDto> {
        const user = req.user;
        if (!user) throw new UnauthorizedException('User not found in request');

        const userProfile = await this.usersService.findOne(user.userId);
        if (!userProfile) throw new NotFoundException('User was already deleted');

        return plainToInstance(ResponseUserDto, userProfile.toObject(), { excludeExtraneousValues: true });
    }

    @Put()
    async updateProfile(@Req() req: any, @Body() updateProfileDto: UpdateProfileDto): Promise<ResponseUserDto> {
        const user = req.user;
        if (!user) throw new UnauthorizedException('User not found in request');

        const updatedUser = await this.usersService.updateProfile(user.userId, updateProfileDto);

        return plainToInstance(ResponseUserDto, updatedUser.toObject(), { excludeExtraneousValues: true });
    }
}
