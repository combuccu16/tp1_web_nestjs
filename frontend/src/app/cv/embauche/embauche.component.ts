import { Component, inject } from '@angular/core';
import { EmbaucheService } from '../services/embauche.service';

@Component({
  imports: [],
  selector: 'app-embauche',
  styleUrl: './embauche.component.css',
  templateUrl: './embauche.component.html',
})
export class EmbaucheComponent {
  private readonly embaucheService = inject(EmbaucheService);
  protected readonly embauchees = this.embaucheService.embaucheesState;
}
