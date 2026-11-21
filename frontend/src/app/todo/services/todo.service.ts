import { Injectable, signal } from '@angular/core';
import { Todo } from '../model/todo';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private readonly todos = signal<Todo[]>([]);
  /** Version en lecture seule du signal : seul le service peut modifier la liste. */
  readonly todosSignal = this.todos.asReadonly();
  private nextId = 1;

  getTodos(): Todo[] {
    return this.todos();
  }

  addTodo(todo: Todo): void {
    const created: Todo = { ...todo, id: this.nextId++ };
    this.todos.update((todos) => [...todos, created]);
  }

  deleteTodo(todo: Todo): void {
    this.todos.update((todos) => todos.filter((item) => item.id !== todo.id));
  }

  logTodos(): void {
    console.log(this.todos());
  }
}
