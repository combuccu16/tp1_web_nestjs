import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { API_ENDPOINTS } from '../../config/api.config';
import { ToastService } from '../../shared/toast/toast.service';
import { Cv } from '../model/cv';

export const FAKE_CVS: readonly Cv[] = [
  new Cv(1, 'Ben Fraj', 'Mohamed Amine', 21, '12345678', 'Développeur', 'images/cv1.png'),
  new Cv(2, 'Eladab', 'Youssef', 42, '87654321', 'Enseignant', 'images/cv2.png'),
  new Cv(3, 'Brahim', 'Amine', 23, '11223344', 'Développeur', 'images/cv3.png'),
  new Cv(4, 'Ilahi', 'Alaa', 22, '44332211', 'Designer', ''),
];

export const API_ERROR_MESSAGE =
  "Problème de connexion à l'API : les CVs de démonstration sont affichés.";

interface ApiCv {
  id: number;
  name: string;
  firstname: string;
  age: number;
  cin: number | string;
  job: string;
  path: string;
}

function isDisplayableImage(path: string): boolean {
  return path.startsWith('images/') || path.startsWith('http');
}

function toCv(cv: ApiCv): Cv {
  return new Cv(
    cv.id,
    cv.name,
    cv.firstname,
    cv.age,
    String(cv.cin),
    cv.job,
    isDisplayableImage(cv.path ?? '') ? cv.path : '',
  );
}

@Service()
export class CvService {
  private readonly http = inject(HttpClient);
  private readonly toastService = inject(ToastService);

  getCvs(): Observable<Cv[]> {
    return this.http.get<ApiCv[]>(API_ENDPOINTS.personnes).pipe(
      map((cvs) => cvs.map(toCv)),
      catchError(() => {
        this.toastService.show(API_ERROR_MESSAGE, 'danger');
        return of([...FAKE_CVS]);
      }),
    );
  }

  getCvById(id: number): Observable<Cv | undefined> {
    return this.http.get<ApiCv>(`${API_ENDPOINTS.personnes}/${id}`).pipe(
      map(toCv),
      catchError(() => {
        this.toastService.show(API_ERROR_MESSAGE, 'danger');
        return of(FAKE_CVS.find((cv) => cv.id === id));
      }),
    );
  }

  deleteCv(id: number): Observable<void> {
    return this.http.delete<void>(`${API_ENDPOINTS.personnes}/${id}`);
  }
}
