import { Component, input, output } from '@angular/core';
import { Cv } from '../model/cv';

@Component({
  imports: [],
  selector: 'app-cv-item',
  styleUrl: './cv-item.component.css',
  templateUrl: './cv-item.component.html',
})
export class CvItemComponent {
  readonly cv = input.required<Cv>();
  readonly selected = output<Cv>();
}
