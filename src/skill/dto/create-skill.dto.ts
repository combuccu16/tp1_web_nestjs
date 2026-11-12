import { IsNotEmpty, IsString } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../common/messages/validation-messages.js';
export class CreateSkillDto {
    @IsNotEmpty({ message: VALIDATION_MESSAGES.designation.isNotEmpty })
    @IsString({ message: VALIDATION_MESSAGES.designation.isString })
    designation: string;
}
