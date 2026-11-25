import { Component, inject, input, numberAttribute, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../shared/toast/toast.service';
import { Cv } from '../model/cv';
import { CvService } from '../services/cv.service';

@Component({
  imports: [RouterLink],
  selector: 'app-cv-details-page',
  styleUrl: './cv-details-page.component.css',
  templateUrl: './cv-details-page.component.html',
})
export class CvDetailsPageComponent {
  private readonly cvService = inject(CvService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  readonly id = input.required({ transform: numberAttribute });

  protected readonly cvResource = rxResource({
    params: () => this.id(),
    stream: ({ params }) => this.cvService.getCvById(params),
  });
  protected readonly deleting = signal(false);

  protected deleteCv(cv: Cv): void {
    this.deleting.set(true);
    this.cvService.deleteCv(cv.id).subscribe({
      next: () => {
        this.toastService.show(`${cv.firstname} ${cv.name} a été supprimé.`, 'success');
        void this.router.navigate(['/cv']);
      },
      error: () => {
        this.deleting.set(false);
        this.toastService.show('La suppression a échoué.', 'danger');
      },
    });
  }
}
