import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ResetToken, ResetTokenDocument } from 'src/libs/schemas/reset-token.schema';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class ResetTokenService {

    constructor(@InjectModel(ResetToken.name) private resetTokenModel: Model<ResetTokenDocument>) {}

    async create(userId: Types.ObjectId, token: string): Promise<ResetTokenDocument> {
        const resetToken = new this.resetTokenModel({ userId, token });
        return await resetToken.save();
    }

    async validateToken(token: string): Promise<ResetTokenDocument> {

        const resetToken = await this.resetTokenModel.findOne({ token, isUsed: false }).exec();

        if (!resetToken || resetToken.expiresAt < new Date()) {
            throw new UnauthorizedException('Token invalid or expired');
        }

        return resetToken;
    }

    async markAsUsed(tokenDoc: ResetTokenDocument): Promise<void> {
        tokenDoc.isUsed = true;
        tokenDoc.usedAt = new Date();
        await tokenDoc.save();
    }

}
