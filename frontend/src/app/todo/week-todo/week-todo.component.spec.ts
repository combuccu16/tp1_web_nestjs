import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DayTodoComponent } from '../day-todo/day-todo.component';
import { TodoService } from '../services/todo.service';
import { WeekTodoComponent } from './week-todo.component';

describe('WeekTodoComponent', () => {
  it('renders five day columns with an independent TodoService each', () => {
    const fixture = TestBed.createComponent(WeekTodoComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('app-day-todo')).toHaveLength(5);

    const [monday, tuesday] = fixture.debugElement.queryAll(By.directive(DayTodoComponent));
    const mondayService = monday.injector.get(TodoService);
    const tuesdayService = tuesday.injector.get(TodoService);

    expect(mondayService).not.toBe(tuesdayService);

    mondayService.addTodo({ name: 'Lundi', content: 'Sport' });
    fixture.detectChanges();

    expect(mondayService.getTodos()).toHaveLength(1);
    expect(tuesdayService.getTodos()).toHaveLength(0);
    expect(TestBed.inject(TodoService).getTodos()).toHaveLength(0);
  });
});
