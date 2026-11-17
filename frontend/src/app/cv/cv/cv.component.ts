import { Component, signal } from '@angular/core';
import { CvDetailComponent } from '../cv-detail/cv-detail.component';
import { CvListComponent } from '../cv-list/cv-list.component';
import { Cv } from '../model/cv';

@Component({
  imports: [CvListComponent, CvDetailComponent],
  selector: 'app-cv',
  styleUrl: './cv.component.css',
  templateUrl: './cv.component.html',
})
export class CvComponent {
  // One source of truth: the list and the selection live only in the parent.
  protected readonly cvs: Cv[] = [
    new Cv(1, 'Ben Fraj', 'Mohamed Amine', 21, '12345678', 'Développeur', 'images/cv1.png'),
    new Cv(2, 'Eladab', 'Youssef', 42, '87654321', 'Enseignant', 'images/cv2.png'),
    new Cv(3, 'Brahim', 'Amine', 23, '11223344', 'Développeur', 'images/cv3.png'),
    new Cv(4, 'Ilahi', 'Alaa', 22, '44332211', 'Designer', ''),
  ];

  protected readonly selectedCv = signal<Cv | undefined>(undefined);

  protected selectCv(cv: Cv): void {
    this.selectedCv.set(cv);
  }
}
