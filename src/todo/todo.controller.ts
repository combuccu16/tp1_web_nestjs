import { Body, Controller, DefaultValuePipe, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Query, } from '@nestjs/common';
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
    dto: CreateTodoDto): Promise<TodoEntity> {
        return this.todoService.addTodo(dto);
    }
    @Patch(':id')
    updateTodo(
    @Param('id', ParseIntPipe)
    id: number, 
    @Body()
    dto: UpdateTodoDto): Promise<TodoEntity> {
        return this.todoService.updateTodo(id, dto);
    }
    @Delete(':id')
    deleteTodo(
    @Param('id', ParseIntPipe)
    id: number): Promise<{
        deleted: true;
        id: number;
    }> {
        return this.todoService.deleteTodo(id);
    }
    @Delete(':id/soft')
    softDeleteTodo(
    @Param('id', ParseIntPipe)
    id: number): Promise<{
        softDeleted: true;
        id: number;
    }> {
        return this.todoService.softDeleteTodo(id);
    }
    @Post(':id/restore')
    @HttpCode(200)
    restoreTodo(
    @Param('id', ParseIntPipe)
    id: number): Promise<{
        restored: true;
        id: number;
    }> {
        return this.todoService.restoreTodo(id);
    }
}
