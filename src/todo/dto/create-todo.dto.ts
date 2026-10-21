import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../common/messages/validation-messages.js';

/**
 * DTO de création d'un todo (utilisé par la route d'ajout).
 *
 * - `name`        : obligatoire, entre 3 et 10 caractères.
 * - `description` : obligatoire, au moins 10 caractères.
 */
export class CreateTodoDto {
	@IsNotEmpty({ message: VALIDATION_MESSAGES.name.isNotEmpty })
	@IsString({ message: VALIDATION_MESSAGES.name.isString })
	@MinLength(3, { message: VALIDATION_MESSAGES.name.minLength })
	@MaxLength(10, { message: VALIDATION_MESSAGES.name.maxLength })
	name: string;

	@IsNotEmpty({ message: VALIDATION_MESSAGES.description.isNotEmpty })
	@IsString({ message: VALIDATION_MESSAGES.description.isString })
	@MinLength(10, { message: VALIDATION_MESSAGES.description.minLength })
	description: string;
}
