import { Component, inject, signal } from '@angular/core';
import { form, FormField, FormRoot } from '@angular/forms/signals';
import { Todo } from '../model/todo';
import { TodoService } from '../services/todo.service';

@Component({
  imports: [FormRoot, FormField],
  selector: 'app-todo',
  styleUrl: './todo.component.css',
  templateUrl: './todo.component.html',
})
export class TodoComponent {
  private readonly todoService = inject(TodoService);

  protected readonly todos = this.todoService.todosSignal;

  // 1. le signal qui porte la valeur du formulaire
  private readonly newTodo = signal({ name: '', content: '' });
  // 2. le FieldTree créé à partir du signal
  protected readonly todoForm = form(this.newTodo);

  protected addTodo(): void {
    const name = this.newTodo().name.trim();
    const content = this.newTodo().content.trim();
    if (!name || !content) {
      return;
    }

    this.todoService.addTodo({ name, content });
    this.newTodo.set({ name: '', content: '' }); // la valeur
    this.todoForm().reset(); // l'état
  }

  protected deleteTodo(todo: Todo): void {
    this.todoService.deleteTodo(todo);
  }

  protected logTodos(): void {
    this.todoService.logTodos();
  }
}
