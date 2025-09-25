import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';


export type ResetTokenDocument = HydratedDocument<ResetToken>;

@Schema({ timestamps: true })
export class ResetToken {
    
    @Prop({ required: true })
    userId: Types.ObjectId;

    @Prop({ required: true, unique: true })
    token: string;
        
    @Prop({ default: () => new Date(Date.now() + 5 * 60 * 1000) })
    expiresAt: Date;

    @Prop({ default: false })
    isUsed: boolean;

    @Prop()
    usedAt?: Date;

}

export const ResetTokenSchema = SchemaFactory.createForClass(ResetToken);

ResetTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
