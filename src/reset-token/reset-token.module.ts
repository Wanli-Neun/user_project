import { Module } from '@nestjs/common';
import { ResetTokenService } from './reset-token.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ResetToken, ResetTokenSchema } from 'src/libs/schemas/reset-token.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ResetToken.name, schema: ResetTokenSchema }])
  ],
  providers: [ResetTokenService],
  exports: [ResetTokenService]
})
export class ResetTokenModule {}
