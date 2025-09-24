import { Controller, Post, Body, Put, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from 'src/libs/dto/auth/signin.dto';
import { SignUpDto } from 'src/libs/dto/auth/signup.dto';
import { ResponseUserDto } from 'src/libs/dto/users/response-user.dto';
import { plainToInstance } from 'class-transformer';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';
import { ChangePasswordDto } from 'src/libs/dto/auth/change-password.dto';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  async signIn(@Body() signinDto: SignInDto) {
    return await this.authService.signIn(signinDto);
  }

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto): Promise<ResponseUserDto> {
    const user = await this.authService.signUp(signUpDto);
    return plainToInstance(ResponseUserDto, user.toObject(), { excludeExtraneousValues: true });
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('change-password')
  async changePassword(@Req() req: any, @Body() changePasswordDto: ChangePasswordDto): Promise<ResponseUserDto> {
    const user = req.user;
    const updatedUser = await this.authService.changePassword(user.userId, changePasswordDto);
    
    return plainToInstance(ResponseUserDto, updatedUser.toObject(), { excludeExtraneousValues: true });
  }

}
