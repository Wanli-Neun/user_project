import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from '../libs/dto/auth/signin.dto';
import { UnauthorizedException } from '@nestjs/common';
import { SignUpDto } from 'src/libs/dto/auth/signup.dto';
import { UserRole } from 'src/libs/dto/users/create-user.dto';
import { UserDocument } from 'src/libs/schemas/users.schema';
import { NotFoundException } from '@nestjs/common';
import { ChangePasswordDto } from 'src/libs/dto/auth/change-password.dto';
import { ResetTokenService } from 'src/reset-token/reset-token.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly resetTokenService: ResetTokenService
    ) {}


    async signIn(signinDto : SignInDto) {

        const user = await this.usersService.findByEmail(signinDto.email);
        if (!user) throw new UnauthorizedException('Invalid email or password');
 
        const isValid = await this.usersService.validatePassword(user, signinDto.password);
        if (!isValid) throw new UnauthorizedException('Invalid email or password');

        const payload = { sub: user._id, email: user.email, role: user.role };
        const access_token = await this.jwtService.signAsync(payload);

        return { access_token };
        
    }

    async signUp(signUpDto: SignUpDto) : Promise<UserDocument> {

        const isValid = await this.usersService.findByEmail(signUpDto.email);
        if (isValid) throw new UnauthorizedException('Email already exists');

        const newUser = await this.usersService.create({
            ...signUpDto,
            role: UserRole.User
        });

        return newUser;
    }

    async changePassword(id: string, changePassword: ChangePasswordDto): Promise<UserDocument> {
        const user = await this.usersService.findOne(id);
        if (!user) throw new NotFoundException('User not found');

        const isValid = await this.usersService.validatePassword(user, changePassword.currentPassword);
        if (!isValid) throw new UnauthorizedException('Current password is incorrect');

        user.password = changePassword.newPassword;
        await user.save();

        return user;
    }

    async forgotPassword(email: string): Promise<string> {
        const user = await this.usersService.findByEmail(email);
        if (!user) throw new NotFoundException('User not found');
        const resetToken = crypto.randomBytes(32).toString('hex');
        const tokenDoc = await this.resetTokenService.create(user._id, resetToken);

        return tokenDoc.token;
    }

    async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {

        const tokenDoc = await this.resetTokenService.validateToken(token);

        const user = await this.usersService.findOne(tokenDoc.userId.toString());
        if (!user) throw new NotFoundException('User not found');

        user.password = newPassword;
        await user.save();

        await this.resetTokenService.markAsUsed(tokenDoc);

        return { message: 'Password reset successfully' };
    }




}
