import { Component, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Todo } from '../model/todo';
import { TodoService } from '../services/todo.service';

@Component({
  imports: [FormsModule],
  selector: 'app-day-todo',
  styleUrl: './day-todo.component.css',
  templateUrl: './day-todo.component.html',
  providers: [TodoService],
})
export class DayTodoComponent {
  readonly day = input.required<string>();

  private readonly todoService = inject(TodoService);

  protected name = '';
  protected content = '';

  protected get todos(): Todo[] {
    return this.todoService.getTodos();
  }

  protected addTodo(): void {
    const name = this.name.trim();
    const content = this.content.trim();
    if (!name || !content) {
      return;
    }

    this.todoService.addTodo({ name, content });
    this.name = '';
    this.content = '';
  }

  protected deleteTodo(todo: Todo): void {
    this.todoService.deleteTodo(todo);
  }
}
