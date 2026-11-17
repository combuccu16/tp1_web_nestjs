import { TestBed } from '@angular/core/testing';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodoService);
  });

  it('adds, lists and deletes todos', () => {
    service.addTodo({ name: 'Acheter', content: 'Du pain' });
    service.addTodo({ name: 'Coder', content: 'Le TP Angular' });

    const todos = service.getTodos();
    expect(todos).toHaveLength(2);
    expect(todos[0]).toMatchObject({ id: 1, name: 'Acheter', content: 'Du pain' });

    service.deleteTodo(todos[0]);
    expect(service.getTodos()).toEqual([{ id: 2, name: 'Coder', content: 'Le TP Angular' }]);
  });

  it('logs the current list', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    service.addTodo({ name: 'A', content: 'B' });

    service.logTodos();

    expect(log).toHaveBeenCalledWith([{ id: 1, name: 'A', content: 'B' }]);
    log.mockRestore();
  });
});
