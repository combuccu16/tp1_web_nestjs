import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoEntity } from './entity/todo.entity.js';

@Module({
	imports: [TypeOrmModule.forFeature([TodoEntity])],
})
export class TodoModule {}
