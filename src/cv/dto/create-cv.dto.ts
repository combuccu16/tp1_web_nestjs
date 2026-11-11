import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString, Matches, Min } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../common/messages/validation-messages.js';
export class CreateCvDto {
    @IsNotEmpty({ message: VALIDATION_MESSAGES.name.isNotEmpty })
    @IsString({ message: VALIDATION_MESSAGES.name.isString })
    name: string;
    @IsNotEmpty({ message: VALIDATION_MESSAGES.firstname.isNotEmpty })
    @IsString({ message: VALIDATION_MESSAGES.firstname.isString })
    firstname: string;
    @IsInt({ message: VALIDATION_MESSAGES.age.isInt })
    @Min(0, { message: VALIDATION_MESSAGES.age.min })
    age: number;
    @IsNotEmpty({ message: VALIDATION_MESSAGES.cin.isNotEmpty })
    @IsString({ message: VALIDATION_MESSAGES.cin.isString })
    @Matches(/^\d{8}$/, { message: VALIDATION_MESSAGES.cin.matches })
    cin: string;
    @IsNotEmpty({ message: VALIDATION_MESSAGES.job.isNotEmpty })
    @IsString({ message: VALIDATION_MESSAGES.job.isString })
    job: string;
    @IsOptional()
    @IsString({ message: VALIDATION_MESSAGES.path.isString })
    path?: string;
    @IsOptional()
    @IsArray({ message: VALIDATION_MESSAGES.skillIds.isArray })
    @IsInt({ each: true, message: VALIDATION_MESSAGES.skillIds.isInt })
    skillIds?: number[];
}
