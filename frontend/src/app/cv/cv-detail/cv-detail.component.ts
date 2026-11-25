import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Cv } from '../model/cv';
import { EmbaucheService } from '../../cv/services/embauche.service';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  imports: [RouterLink],
  selector: 'app-cv-detail',
  styleUrl: './cv-detail.component.css',
  templateUrl: './cv-detail.component.html',
})
export class CvDetailComponent {
  readonly cv = input<Cv | undefined>(undefined);

  private readonly embaucheService = inject(EmbaucheService);
  private readonly toastService = inject(ToastService);

  protected embaucher(): void {
    const cv = this.cv();
    if (!cv) {
      return;
    }

    if (!this.embaucheService.embaucher(cv)) {
      this.toastService.show(`${cv.firstname} ${cv.name} est déjà embauché`, 'warning');
      return;
    }

    if (this.embaucheService.budgetDepasse()) {
      this.toastService.show('Budget dépassé', 'danger');
    }
  }
}
