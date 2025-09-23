import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonMiddlewareModule } from './libs/middlewares/common-middleware.module';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forRoot('mongodb://localhost:27017/sample_users'),
    CommonMiddlewareModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
