import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../libs/strategies/jwt.strategy';
import { ResetTokenModule } from 'src/reset-token/reset-token.module';


@Module({
  imports: [
    UsersModule,
    ResetTokenModule,
    PassportModule,
    JwtModule.register({
      secret: 'supersecretkey',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
