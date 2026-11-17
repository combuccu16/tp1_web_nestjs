import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

const REMISE_SEUIL_MIN = 10;
const REMISE_SEUIL_MAX = 15;
const TAUX_REMISE_INTERMEDIAIRE = 0.2;
const TAUX_REMISE_IMPORTANTE = 0.3;
const TAUX_SANS_REMISE = 0;

@Component({
  imports: [FormsModule, CurrencyPipe],
  selector: 'app-ttc',
  styleUrl: './ttc.component.css',
  templateUrl: './ttc.component.html',
})
export class TtcComponent {
  prixHT = 0;
  quantite = 1;
  tva = 18;

  private get quantiteEffective(): number {
    return Math.max(this.quantite, 0);
  }

  protected get tauxRemise(): number {
    // « entre 10 et 15 » est pris au sens inclusif : la quantité 10 ouvre droit à 20 %.
    // La capture du sujet affiche $0.00 pour 10, mais l'énoncé écrit prévaut car ses
    // bornes sont explicites ; les seuils restent des constantes nommées.
    if (this.quantiteEffective >= REMISE_SEUIL_MIN && this.quantiteEffective <= REMISE_SEUIL_MAX) {
      return TAUX_REMISE_INTERMEDIAIRE;
    }
    if (this.quantiteEffective > REMISE_SEUIL_MAX) {
      return TAUX_REMISE_IMPORTANTE;
    }
    return TAUX_SANS_REMISE;
  }

  protected get prixUnitaireTtc(): number {
    if (this.prixHT < 0 || this.tva < 0) {
      return 0;
    }
    return this.prixHT * (1 + this.tva / 100);
  }

  protected get remise(): number {
    return this.prixUnitaireTtc * this.quantiteEffective * this.tauxRemise;
  }

  protected get prixTotalTtc(): number {
    return this.prixUnitaireTtc * this.quantiteEffective - this.remise;
  }
}
