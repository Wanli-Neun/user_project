import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../libs/schemas/users.schema';
import { ProfileController } from './profile.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [AdminController, ProfileController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
