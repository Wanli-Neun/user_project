import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from 'src/libs/dto/signin.dto';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  async signIn(@Body() signinDto: SignInDto) {
    return await this.authService.signIn(signinDto);
  }

}
