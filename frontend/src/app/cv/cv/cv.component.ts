import { Component, inject, signal } from '@angular/core';
import { CvDetailComponent } from '../cv-detail/cv-detail.component';
import { CvListComponent } from '../cv-list/cv-list.component';
import { EmbaucheComponent } from '../embauche/embauche.component';
import { Cv } from '../model/cv';
import { CvService } from '../services/cv.service';

@Component({
  imports: [CvListComponent, CvDetailComponent, EmbaucheComponent],
  selector: 'app-cv',
  styleUrl: './cv.component.css',
  templateUrl: './cv.component.html',
})
export class CvComponent {
  private readonly cvService = inject(CvService);
  protected readonly cvs = this.cvService.getCvs();

  protected readonly selectedCv = signal<Cv | undefined>(undefined);

  protected selectCv(cv: Cv): void {
    this.selectedCv.set(cv);
  }
}
