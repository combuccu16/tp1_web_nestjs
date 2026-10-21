import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoEntity } from './entity/todo.entity.js';
import { TodoController } from './todo.controller.js';
import { TodoService } from './todo.service.js';

@Module({
	imports: [TypeOrmModule.forFeature([TodoEntity])],
	controllers: [TodoController],
	providers: [TodoService],
})
export class TodoModule {}
