import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum} from 'class-validator';

export enum UserRole {
    Admin = 'admin',
    User = 'user'
}

export class CreateUserDto {

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    password: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    name: string;

    @IsEnum(UserRole, { message: 'Role must be admin or user' })
    role: UserRole;

}