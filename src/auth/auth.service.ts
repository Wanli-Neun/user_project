import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from '../libs/dto/auth/signin.dto';
import { UnauthorizedException } from '@nestjs/common';
import { SignUpDto } from 'src/libs/dto/auth/signup.dto';
import { UserRole } from 'src/libs/dto/users/create-user.dto';
import { UserDocument } from 'src/libs/schemas/users.schema';


@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
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



}
