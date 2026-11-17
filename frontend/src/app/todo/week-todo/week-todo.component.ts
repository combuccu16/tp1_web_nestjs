import { Component } from '@angular/core';
import { DayTodoComponent } from '../day-todo/day-todo.component';

@Component({
  imports: [DayTodoComponent],
  selector: 'app-week-todo',
  styleUrl: './week-todo.component.css',
  templateUrl: './week-todo.component.html',
})
export class WeekTodoComponent {
  protected readonly days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
}
