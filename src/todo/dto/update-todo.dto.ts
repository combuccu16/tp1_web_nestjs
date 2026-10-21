import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../common/messages/validation-messages.js';
import { StatusEnum } from '../entity/status.enum.js';
import { CreateTodoDto } from './create-todo.dto.js';

/**
 * DTO propre à la mise à jour d'un todo (utilisé par la route d'update).
 *
 * - Aucun champ n'est obligatoire : `PartialType` reprend tous les champs de
 *   `CreateTodoDto` en les rendant optionnels, tout en conservant leurs
 *   contraintes de taille (pas de duplication).
 * - `status` est en plus accepté, et doit obligatoirement être une des valeurs
 *   de `StatusEnum` s'il est fourni (`@IsOptional` : absent = pas de validation).
 */
export class UpdateTodoDto extends PartialType(CreateTodoDto) {
	@IsOptional()
	@IsEnum(StatusEnum, {
		message: VALIDATION_MESSAGES.status.isEnum(Object.values(StatusEnum)),
	})
	status?: StatusEnum;
}
