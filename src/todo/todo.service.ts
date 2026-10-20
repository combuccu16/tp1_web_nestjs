import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto.js';
import { UpdateTodoDto } from './dto/update-todo.dto.js';
import { TodoEntity } from './entity/todo.entity.js';
import { StatusEnum } from './entity/status.enum.js';

/**
 * Service des opérations d'écriture sur les todos (parties 5 & 6 du TP) :
 * ajout, mise à jour, suppression physique, suppression logique et restauration.
 *
 * Toutes les méthodes passent par le `Repository<TodoEntity>` injecté par
 * TypeORM via `@InjectRepository` (généré par `TypeOrmModule.forFeature`
 * déclaré dans `TodoModule`).
 *
 * Remarque importante sur la suppression logique : TypeORM ajoute
 * automatiquement `WHERE deletedAt IS NULL` à `findOne` / `find`, donc les
 * todos soft-deletés sont ignorés par défaut. Il faut `withDeleted: true`
 * pour les voir.
 */
@Injectable()
export class TodoService {
	constructor(
		@InjectRepository(TodoEntity)
		private readonly todoRepository: Repository<TodoEntity>,
	) {}

	/** E1/E3/E4 — List todos with optional text/status filters and pagination. */
	async getAll(
		search?: string,
		status?: StatusEnum,
		page = 1,
		limit = 10,
	): Promise<{ data: TodoEntity[]; page: number; limit: number; total: number }> {
		if (!Number.isInteger(page) || page < 1) {
			throw new BadRequestException('page must be a positive integer');
		}
		if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
			throw new BadRequestException('limit must be an integer between 1 and 100');
		}
		if (status !== undefined && !Object.values(StatusEnum).includes(status)) {
			throw new BadRequestException(`status must be one of: ${Object.values(StatusEnum).join(', ')}`);
		}

		const where = search
			? [
					{ name: Like(`%${search}%`), ...(status ? { status } : {}) },
					{ description: Like(`%${search}%`), ...(status ? { status } : {}) },
				]
			: status
				? { status }
				: {};
		const [data, total] = await this.todoRepository.findAndCount({
			where,
			order: { id: 'ASC' },
			skip: (page - 1) * limit,
			take: limit,
		});

		return { data, page, limit, total };
	}

	/** E2 — Find one active todo, returning 404 when it does not exist. */
	async getById(id: number): Promise<TodoEntity> {
		const todo = await this.todoRepository.findOne({ where: { id } });
		if (!todo) {
			throw new NotFoundException(`Todo #${id} not found`);
		}
		return todo;
	}

	/**
	 * D1 — Ajoute un todo en base.
	 *
	 * ══════════════════════════════════════════════════════════════════
	 * VERSION 1 (celle utilisée par le contrôleur) : `create()` + `save()`
	 * ══════════════════════════════════════════════════════════════════
	 * - `create(dto)` construit **en mémoire** une instance de `TodoEntity`
	 *   à partir du DTO : aucune requête SQL n'est envoyée.
	 *   Il s'agit de l'objet "managé" : il porte l'`id` une fois inséré.
	 * - `save(entity)` détecte qu'il n'a pas d'`id` → il émet un `INSERT`,
	 *   laisse TypeORM remplir les colonnes automatiques (`createdAt`,
	 *   `updatedAt`, `status` par défaut) et **retourne l'entité complète**
	 *   avec l'id généré.
	 * - Les hooks/listeners d'entité (`@BeforeInsert`, subscribers) sont
	 *   exécutés : c'est le chemin "officiel" et objet de TypeORM.
	 */
	async addTodo(dto: CreateTodoDto): Promise<TodoEntity> {
		const todo = this.todoRepository.create(dto);
		return await this.todoRepository.save(todo);
	}

	/**
	 * D1 — **Version 2** (gardée pour la validation, non exposée par le
	 * contrôleur) : insertion via un **Query Builder**.
	 *
	 * ══════════════════════════════════════════════════════════════════
	 * VERSION 2 : `createQueryBuilder().insert().values(dto)`
	 * ══════════════════════════════════════════════════════════════════
	 * - On construit directement la requête SQL `INSERT INTO todos ...`
	 *   sans jamais créer d'objet `TodoEntity` intermédiaire.
	 * - Le résultat est un `InsertResult` (identifiers / raw), **pas**
	 *   l'entité hydratée : il faut re-lire la ligne pour l'obtenir.
	 * - Les listeners/persisters d'entité ne sont **pas** déclenchés.
	 * - Intérêt : requêtes plus "brutes" et performantes, idéal pour des
	 *   inserts massifs ; inconvénient : moins d'abstraction, tout se
	 *   fait à la main.
	 *
	 * À retenir pour l'entretien : la différence porte sur **l'objet
	 * managé** (version 1) vs **la requête brute** (version 2).
	 */
	async addTodoWithQueryBuilder(dto: CreateTodoDto): Promise<TodoEntity> {
		const { identifiers } = await this.todoRepository
			.createQueryBuilder()
			.insert()
			.values(dto)
			.execute();

		// L'insert brute ne retourne que l'id inséré : on relit l'entité.
		const created = await this.todoRepository.findOne({
			where: { id: Number(identifiers[0].id) },
		});
		if (!created) {
			throw new NotFoundException('Todo not found right after its insertion');
		}
		return created;
	}

	/**
	 * D2 — Met à jour un todo existant via son id.
	 *
	 * On charge d'abord l'entité (`findOne`) puisqu'il faut :
	 * 1. renvoyer un 404 `NotFoundException` si l'id n'existe pas ;
	 * 2. renvoyer l'entité **complète** mise à jour (et non juste
	 *    `affected: 1` comme le ferait un `repository.update(id, dto)`).
	 *
	 * `Object.assign` applique uniquement les champs présents dans le DTO
	 * (le `UpdateTodoDto` est partiel : aucun champ obligatoire), donc on
	 * ne détruit pas les autres colonnes.
	 * `save()` détecte que l'entité a un `id` → `UPDATE`, et TypeORM met
	 * à jour `updatedAt` automatiquement (`@UpdateDateColumn`).
	 *
	 * Attention : `findOne` ignore les todos soft-deletés → mettre à jour
	 * un todo supprimé logiquement renvoie aussi un 404. C'est voulu.
	 */
	async updateTodo(id: number, dto: UpdateTodoDto): Promise<TodoEntity> {
		const todo = await this.todoRepository.findOne({ where: { id } });
		if (!todo) {
			throw new NotFoundException(`Todo #${id} not found`);
		}

		Object.assign(todo, dto);
		return await this.todoRepository.save(todo);
	}

	/**
	 * D3 — Suppression **physique et définitive** du todo (DELETE réel).
	 *
	 * `delete(id)` génère `DELETE FROM todos WHERE id = :id`.
	 * `UpdateResult.affected` contient le nombre de lignes supprimées :
	 * 0 signifie que l'id n'existait pas → 404.
	 *
	 * Note : contrairement à `findOne`, la clause `deletedAt IS NULL` n'est
	 * PAS ajoutée ici, donc ce endpoint supprime aussi (définitivement)
	 * un todo qui avait été soft-deleté.
	 */
	async deleteTodo(id: number): Promise<{ deleted: true; id: number }> {
		const { affected } = await this.todoRepository.delete(id);
		if (!affected) {
			throw new NotFoundException(`Todo #${id} not found`);
		}
		return { deleted: true, id };
	}

	/**
	 * D4 — Suppression **logique** (soft delete) du todo via son id.
	 *
	 * `softDelete(id)` ne fait PAS de `DELETE` : TypeORM exécute un
	 * `UPDATE todos SET deletedAt = <now> WHERE id = :id AND deletedAt IS NULL`.
	 * La ligne reste en base, simplement marquée comme supprimée.
	 *
	 * C'est pour ça que `deletedAt` est un `@DeleteDateColumn` (B4) :
	 * TypeORM sait que cette colonne signifie "supprimé logiquement" et
	 * ajoute donc automatiquement `deletedAt IS NULL` à toutes les
	 * lectures (`findOne`, `find`, `count`, ...).
	 */
	async softDeleteTodo(id: number): Promise<{ softDeleted: true; id: number }> {
		const { affected } = await this.todoRepository.softDelete(id);
		if (!affected) {
			throw new NotFoundException(`Todo #${id} not found`);
		}
		return { softDeleted: true, id };
	}

	/**
	 * D5 — Restaure un todo supprimé logiquement.
	 *
	 * `restore(id)` génère `UPDATE todos SET deletedAt = NULL WHERE id = :id`
	 * : la ligne redevient visible par les lectures normales.
	 *
	 * Si la row n'existe pas du tout, `affected` vaut 0 → 404.
	 * (Restaurer un todo déjà actif ne change rien : il est simplement
	 * réécrit avec `deletedAt = NULL`.)
	 */
	async restoreTodo(id: number): Promise<{ restored: true; id: number }> {
		const { affected } = await this.todoRepository.restore(id);
		if (!affected) {
			throw new NotFoundException(`Todo #${id} not found`);
		}
		return { restored: true, id };
	}
}
