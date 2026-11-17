import { Component, input, output } from '@angular/core';
import { Cv } from '../model/cv';
import { CvItemComponent } from '../cv-item/cv-item.component';

@Component({
  imports: [CvItemComponent],
  selector: 'app-cv-list',
  styleUrl: './cv-list.component.css',
  templateUrl: './cv-list.component.html',
})
export class CvListComponent {
  readonly cvs = input.required<Cv[]>();
  readonly selectedCv = input<Cv | undefined>(undefined);
  readonly cvSelected = output<Cv>();
}
