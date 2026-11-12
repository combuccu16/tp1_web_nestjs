import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../common/messages/validation-messages.js';
import { RoleEnum } from '../enums/role.enum.js';
export class CreateUserDto {
    @IsNotEmpty({ message: VALIDATION_MESSAGES.username.isNotEmpty })
    @IsString({ message: VALIDATION_MESSAGES.username.isString })
    @MinLength(3, { message: VALIDATION_MESSAGES.username.minLength })
    @MaxLength(30, { message: VALIDATION_MESSAGES.username.maxLength })
    username: string;
    @IsNotEmpty({ message: VALIDATION_MESSAGES.email.isNotEmpty })
    @IsEmail({}, { message: VALIDATION_MESSAGES.email.isEmail })
    email: string;
    @IsNotEmpty({ message: VALIDATION_MESSAGES.password.isNotEmpty })
    @IsString({ message: VALIDATION_MESSAGES.password.isString })
    @MinLength(6, { message: VALIDATION_MESSAGES.password.minLength })
    password: string;
    @IsOptional()
    @IsEnum(RoleEnum, {
        message: VALIDATION_MESSAGES.role.isEnum(Object.values(RoleEnum)),
    })
    role?: RoleEnum;
}
