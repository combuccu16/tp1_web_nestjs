import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { VALIDATION_MESSAGES } from '../../common/messages/validation-messages.js';
import { StatusEnum } from '../entity/status.enum.js';
import { CreateTodoDto } from './create-todo.dto.js';
export class UpdateTodoDto extends PartialType(CreateTodoDto) {
    @IsOptional()
    @IsEnum(StatusEnum, {
        message: VALIDATION_MESSAGES.status.isEnum(Object.values(StatusEnum)),
    })
    status?: StatusEnum;
}
