import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Like, Not, Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto.js';
import { UpdateTodoDto } from './dto/update-todo.dto.js';
import { TodoEntity } from './entity/todo.entity.js';
import { StatusEnum } from './entity/status.enum.js';
export interface TodoStats {
    total: number;
    byStatus: Record<StatusEnum, number>;
}
@Injectable()
export class TodoService {
    constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepository: Repository<TodoEntity>) { }
    async getAll(search?: string, status?: StatusEnum, page = 1, limit = 10): Promise<{
        data: TodoEntity[];
        page: number;
        limit: number;
        total: number;
    }> {
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
    async getById(id: number): Promise<TodoEntity> {
        const todo = await this.todoRepository.findOne({ where: { id } });
        if (!todo) {
            throw new NotFoundException(`Todo #${id} not found`);
        }
        return todo;
    }
    async addTodo(dto: CreateTodoDto): Promise<TodoEntity> {
        const todo = this.todoRepository.create(dto);
        return await this.todoRepository.save(todo);
    }
    async addTodoWithQueryBuilder(dto: CreateTodoDto): Promise<TodoEntity> {
        const { identifiers } = await this.todoRepository
            .createQueryBuilder()
            .insert()
            .values(dto)
            .execute();
        const created = await this.todoRepository.findOne({
            where: { id: Number(identifiers[0].id) },
        });
        if (!created) {
            throw new NotFoundException('Todo not found right after its insertion');
        }
        return created;
    }
    async updateTodo(id: number, dto: UpdateTodoDto): Promise<TodoEntity> {
        const todo = await this.todoRepository.findOne({ where: { id } });
        if (!todo) {
            throw new NotFoundException(`Todo #${id} not found`);
        }
        Object.assign(todo, dto);
        return await this.todoRepository.save(todo);
    }
    async deleteTodo(id: number): Promise<{
        deleted: true;
        id: number;
    }> {
        const { affected } = await this.todoRepository.delete(id);
        if (!affected) {
            throw new NotFoundException(`Todo #${id} not found`);
        }
        return { deleted: true, id };
    }
    async softDeleteTodo(id: number): Promise<{
        softDeleted: true;
        id: number;
    }> {
        const { affected } = await this.todoRepository.softDelete(id);
        if (!affected) {
            throw new NotFoundException(`Todo #${id} not found`);
        }
        return { softDeleted: true, id };
    }
    async restoreTodo(id: number): Promise<{
        restored: true;
        id: number;
    }> {
        const { affected } = await this.todoRepository.restore(id);
        if (!affected) {
            throw new NotFoundException(`Todo #${id} not found`);
        }
        return { restored: true, id };
    }
    async getDeletedTodos(): Promise<TodoEntity[]> {
        return this.todoRepository.find({
            withDeleted: true,
            where: { deletedAt: Not(IsNull()) },
            order: { id: 'ASC' },
        });
    }
    async getStats(): Promise<TodoStats> {
        const rows = await this.todoRepository
            .createQueryBuilder('todo')
            .select('todo.status', 'status')
            .addSelect('COUNT(*)', 'count')
            .where('todo.deletedAt IS NULL')
            .groupBy('todo.status')
            .getRawMany<{
            status: StatusEnum;
            count: number;
        }>();
        const byStatus = Object.fromEntries(Object.values(StatusEnum).map((status) => [status, 0])) as Record<StatusEnum, number>;
        let total = 0;
        for (const row of rows) {
            const count = Number(row.count);
            byStatus[row.status] = count;
            total += count;
        }
        return { total, byStatus };
    }
}
