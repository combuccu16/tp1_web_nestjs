import { Component, inject, input, signal } from '@angular/core';
import { form, FormField, FormRoot } from '@angular/forms/signals';
import { Todo } from '../model/todo';
import { TodoService } from '../services/todo.service';

@Component({
  imports: [FormRoot, FormField],
  selector: 'app-day-todo',
  styleUrl: './day-todo.component.css',
  templateUrl: './day-todo.component.html',
  providers: [TodoService],
})
export class DayTodoComponent {
  readonly day = input.required<string>();

  private readonly todoService = inject(TodoService);

  protected readonly todos = this.todoService.todosSignal;

  private readonly newTodo = signal({ name: '', content: '' });
  protected readonly todoForm = form(this.newTodo);

  protected addTodo(): void {
    const name = this.newTodo().name.trim();
    const content = this.newTodo().content.trim();
    if (!name || !content) {
      return;
    }

    this.todoService.addTodo({ name, content });
    this.newTodo.set({ name: '', content: '' });
    this.todoForm().reset();
  }

  protected deleteTodo(todo: Todo): void {
    this.todoService.deleteTodo(todo);
  }
}
