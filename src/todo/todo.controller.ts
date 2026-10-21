import {
	Body,
	Controller,
	DefaultValuePipe,
	Delete,
	Get,
	HttpCode,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Query,
} from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto.js';
import { UpdateTodoDto } from './dto/update-todo.dto.js';
import { TodoEntity } from './entity/todo.entity.js';
import { StatusEnum } from './entity/status.enum.js';
import { TodoService } from './todo.service.js';

/**
 * Routes sur les todos : écriture (D1 → D6), lecture (E1 → E4) et
 * statistiques (partie 7).
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
 *
 * ⚠️ L'ordre de déclaration des routes GET compte : Express les teste dans
 * l'ordre. Les routes littérales (`/todos/stats`) doivent donc précéder les
 * routes paramétrées (`/todos/:id`), sinon `:id` les absorbe et renvoie 400.
 */
@Controller('todos')
export class TodoController {
	constructor(private readonly todoService: TodoService) {}

	// E1/E3/E4 — GET /todos?q=...&status=...&page=1&limit=10.
	// `q` matches name OR description; status is combined with that OR filter.
	@Get()
	getAll(
		@Query('q') search?: string,
		@Query('status') status?: StatusEnum,
		@Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
		@Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
	): ReturnType<TodoService['getAll']> {
		return this.todoService.getAll(search, status, page, limit);
	}

	// Partie 7 — GET /todos/stats.
	//
	// ⚠️ Cette route DOIT être déclarée AVANT `@Get(':id')` :
	// Express teste les routes dans l'ordre de déclaration, donc `:id`
	// absorberait `/todos/stats` et `ParseIntPipe` renverrait un 400
	// (au lieu de 200 avec les statistiques).
	@Get('stats')
	getStats(): ReturnType<TodoService['getStats']> {
		return this.todoService.getStats();
	}

	// D6 — GET /todos/trash : les todos supprimés logiquement.
	//
	// ⚠️ Comme `@Get('stats')`, cette route littérale DOIT être déclarée
	// AVANT `@Get(':id')` : sinon `:id` absorberait "trash" et
	// `ParseIntPipe` renverrait un 400 au lieu de la liste.
	@Get('trash')
	getDeletedTodos(): Promise<TodoEntity[]> {
		return this.todoService.getDeletedTodos();
	}

	// E2 — GET /todos/:id; ParseIntPipe returns 400 for a non-integer id.
	@Get(':id')
	getById(@Param('id', ParseIntPipe) id: number): Promise<TodoEntity> {
		return this.todoService.getById(id);
	}

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
	//
	// `@HttpCode(200)` : NestJS répond 201 Created par défaut sur un POST,
	// or cette route ne *crée* aucune ressource — elle change l'état d'une
	// ligne existante. 200 OK décrit donc la réponse plus fidèlement.
	// (À l'inverse, `POST /todos` garde bien son 201 : là, une ressource
	// est réellement créée.)
	@Post(':id/restore')
	@HttpCode(200)
	restoreTodo(@Param('id', ParseIntPipe) id: number): Promise<{ restored: true; id: number }> {
		return this.todoService.restoreTodo(id);
	}
}
