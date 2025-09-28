import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

import { Transform } from 'class-transformer';

export class ImportUserDto {
  
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => String(value).trim().toLowerCase())
  email!: string;


  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @Transform(({ value }) => String(value).trim())
  name!: string;

}


export const IMPORT_USER_ALLOWED_HEADERS = ['email', 'name'] as const;

export type ImportUserRowRaw = Record<string, any>;
