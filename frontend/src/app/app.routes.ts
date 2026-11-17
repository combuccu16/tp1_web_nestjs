import { Routes } from '@angular/router';
import { ColorComponent } from './color/color.component';
import { CvComponent } from './cv/cv/cv.component';
import { HomeComponent } from './home/home.component';
import { MiniWordComponent } from './mini-word/mini-word.component';
import { TodoComponent } from './todo/todo/todo.component';
import { WeekTodoComponent } from './todo/week-todo/week-todo.component';
import { TtcComponent } from './ttc/ttc.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'CvTech' },
  { path: 'cv', component: CvComponent, title: 'CvTech - Cv' },
  { path: 'todo', component: TodoComponent, title: 'CvTech - Todo' },
  { path: 'week-todo', component: WeekTodoComponent, title: 'CvTech - Week todo' },
  { path: 'word', component: MiniWordComponent, title: 'CvTech - Mini word' },
  { path: 'color', component: ColorComponent, title: 'CvTech - Color' },
  { path: 'ttc', component: TtcComponent, title: 'CvTech - TTC' },
  { path: '**', redirectTo: '' },
];
