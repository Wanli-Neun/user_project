import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from '../libs/dto/signin.dto';
import { UnauthorizedException } from '@nestjs/common';


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


}
