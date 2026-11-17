import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  selector: 'app-ttc',
  styleUrl: './ttc.component.css',
  templateUrl: './ttc.component.html',
})
export class TtcComponent {
  prixHT = 0;
  quantite = 1;
  tva = 18;
}
