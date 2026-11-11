import { IsNotEmpty, IsString } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../common/messages/validation-messages.js';

/**
 * DTO de création d'un skill (utilisé par la route d'ajout).
 *
 * - `designation` : obligatoire, chaîne de caractères.
 */
export class CreateSkillDto {
    @IsNotEmpty({ message: VALIDATION_MESSAGES.designation.isNotEmpty })
    @IsString({ message: VALIDATION_MESSAGES.designation.isString })
    designation: string;
}
