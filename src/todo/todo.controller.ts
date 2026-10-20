import { Body, Controller, Delete, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto.js';
import { UpdateTodoDto } from './dto/update-todo.dto.js';
import { TodoEntity } from './entity/todo.entity.js';
import { TodoService } from './todo.service.js';

/**
 * Routes d'écriture sur les todos (D1 → D6).
 *
 * Méthode HTTP choisie selon l'intention :
 * - POST    → créer une ressource            (addTodo)
 * - PATCH   → mise à jour partielle          (updateTodo, DTO partiel)
 * - DELETE  → suppression définitive         (deleteTodo)
 * - DELETE  → suppression logique + chemin   (softDeleteTodo)
 * - POST    → action qui change l'état        (restoreTodo)
 *
 * `ParseIntPipe` convertit le paramètre d'URL en `number` et renvoie
 * automatiquement un 400 si l'id n'est pas un entier.
 * La validation du body (CreateTodoDto / UpdateTodoDto) est assurée par le
 * `ValidationPipe` global configuré dans `main.ts`.
 */
@Controller('todos')
export class TodoController {
	constructor(private readonly todoService: TodoService) {}

	// D1 — POST /todos : ajoute un todo.
	// Répond 201 Created avec le todo créé (id, createdAt, updatedAt, status...).
	@Post()
	addTodo(@Body() dto: CreateTodoDto): Promise<TodoEntity> {
		return this.todoService.addTodo(dto);
	}

	// D2 — PATCH /todos/:id : met à jour partiellement un todo.
	@Patch(':id')
	updateTodo(
		@Param('id', ParseIntPipe) id: number,
		@Body() dto: UpdateTodoDto,
	): Promise<TodoEntity> {
		return this.todoService.updateTodo(id, dto);
	}

	// D3 — DELETE /todos/:id : supprime définitivement le todo (DELETE SQL).
	@Delete(':id')
	deleteTodo(@Param('id', ParseIntPipe) id: number): Promise<{ deleted: true; id: number }> {
		return this.todoService.deleteTodo(id);
	}

	// D4 — DELETE /todos/:id/soft : suppression logique (remplit deletedAt).
	// Chemin distinct de `:id` : Express le matche sur 2 segments, pas de conflit.
	@Delete(':id/soft')
	softDeleteTodo(
		@Param('id', ParseIntPipe) id: number,
	): Promise<{ softDeleted: true; id: number }> {
		return this.todoService.softDeleteTodo(id);
	}

	// D5 — POST /todos/:id/restore : restaure un todo soft-deleté.
	@Post(':id/restore')
	restoreTodo(@Param('id', ParseIntPipe) id: number): Promise<{ restored: true; id: number }> {
		return this.todoService.restoreTodo(id);
	}
}
