import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonMiddlewareModule } from './libs/middlewares/common-middleware.module';
import { AuthModule } from './auth/auth.module';
import { ResetTokenModule } from './reset-token/reset-token.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forRoot('mongodb://localhost:27017/sample_users'),
    CommonMiddlewareModule,
    AuthModule,
    ResetTokenModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
