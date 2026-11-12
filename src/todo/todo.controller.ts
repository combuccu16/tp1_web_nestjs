import { Body, Controller, DefaultValuePipe, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Query, Req, } from '@nestjs/common';
import type { RequestWithUserId } from '../common/interfaces/request-with-user-id.interface.js';
import { CreateTodoDto } from './dto/create-todo.dto.js';
import { UpdateTodoDto } from './dto/update-todo.dto.js';
import { TodoEntity } from './entity/todo.entity.js';
import { StatusEnum } from './entity/status.enum.js';
import { TodoService } from './todo.service.js';
@Controller('todos')
export class TodoController {
    constructor(private readonly todoService: TodoService) { }
    @Get()
    getAll(
    @Query('q')
    search?: string, 
    @Query('status')
    status?: StatusEnum, 
    @Query('page', new DefaultValuePipe(1), ParseIntPipe)
    page = 1, 
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
    limit = 10): ReturnType<TodoService['getAll']> {
        return this.todoService.getAll(search, status, page, limit);
    }
    @Get('stats')
    getStats(): ReturnType<TodoService['getStats']> {
        return this.todoService.getStats();
    }
    @Get('trash')
    getDeletedTodos(): Promise<TodoEntity[]> {
        return this.todoService.getDeletedTodos();
    }
    @Get(':id')
    getById(
    @Param('id', ParseIntPipe)
    id: number): Promise<TodoEntity> {
        return this.todoService.getById(id);
    }
    @Post()
    addTodo(
    @Body()
    dto: CreateTodoDto, 
    @Req()
    req: RequestWithUserId): Promise<TodoEntity> {
        return this.todoService.addTodo(dto, req.userId);
    }
    @Patch(':id')
    updateTodo(
    @Param('id', ParseIntPipe)
    id: number, 
    @Body()
    dto: UpdateTodoDto, 
    @Req()
    req: RequestWithUserId): Promise<TodoEntity> {
        return this.todoService.updateTodo(id, dto, req.userId);
    }
    @Delete(':id')
    deleteTodo(
    @Param('id', ParseIntPipe)
    id: number, 
    @Req()
    req: RequestWithUserId): Promise<{
        deleted: true;
        id: number;
    }> {
        return this.todoService.deleteTodo(id, req.userId);
    }
    @Delete(':id/soft')
    softDeleteTodo(
    @Param('id', ParseIntPipe)
    id: number, 
    @Req()
    req: RequestWithUserId): Promise<{
        softDeleted: true;
        id: number;
    }> {
        return this.todoService.softDeleteTodo(id, req.userId);
    }
    @Post(':id/restore')
    @HttpCode(200)
    restoreTodo(
    @Param('id', ParseIntPipe)
    id: number, 
    @Req()
    req: RequestWithUserId): Promise<{
        restored: true;
        id: number;
    }> {
        return this.todoService.restoreTodo(id, req.userId);
    }
}
