import { IsEmail, IsEnum, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";
import { Role } from "src/common/enums/roles.enum";

export class RegisterDto {
 
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsStrongPassword()
    password: string;

    @IsEnum(Role)
    role: Role;
}