import { Injectable } from '@angular/core';
import { Cv } from '../model/cv';

@Injectable({ providedIn: 'root' })
export class CvService {
  private readonly cvs: Cv[] = [
    new Cv(1, 'Ben Fraj', 'Mohamed Amine', 21, '12345678', 'Développeur', 'images/cv1.png'),
    new Cv(2, 'Eladab', 'Youssef', 42, '87654321', 'Enseignant', 'images/cv2.png'),
    new Cv(3, 'Brahim', 'Amine', 23, '11223344', 'Développeur', 'images/cv3.png'),
    new Cv(4, 'Ilahi', 'Alaa', 22, '44332211', 'Designer', ''),
  ];

  getCvs(): Cv[] {
    return [...this.cvs];
  }

  getCvById(id: number): Cv | undefined {
    return this.cvs.find((cv) => cv.id === id);
  }
}
