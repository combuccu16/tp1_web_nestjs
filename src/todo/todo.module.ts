import { type MiddlewareConsumer, Module, type NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from '../common/middlewares/auth.middleware.js';
import { TodoEntity } from './entity/todo.entity.js';
import { TodoController } from './todo.controller.js';
import { TodoService } from './todo.service.js';
@Module({
    imports: [TypeOrmModule.forFeature([TodoEntity])],
    controllers: [TodoController],
    providers: [TodoService],
})
export class TodoModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(AuthMiddleware).forRoutes(TodoController);
    }
}
