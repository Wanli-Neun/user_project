import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @MinLength(3)
  currentPassword: string;

  @IsString()
  @MinLength(3)
  newPassword: string;
}
