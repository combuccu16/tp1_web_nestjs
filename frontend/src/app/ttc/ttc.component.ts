import { CurrencyPipe } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { form, FormField, min } from '@angular/forms/signals';

const REMISE_SEUIL_MIN = 10;
const REMISE_SEUIL_MAX = 15;
const TAUX_REMISE_INTERMEDIAIRE = 0.2;
const TAUX_REMISE_IMPORTANTE = 0.3;
const TAUX_SANS_REMISE = 0;

export const TTC_DEFAULTS = { prixHT: 0, quantite: 1, tva: 18 } as const;

@Component({
  imports: [FormField, CurrencyPipe],
  selector: 'app-ttc',
  styleUrl: './ttc.component.css',
  templateUrl: './ttc.component.html',
})
export class TtcComponent {
  private readonly valeurs = signal({ ...TTC_DEFAULTS });

  protected readonly ttcForm = form(this.valeurs, (path) => {
    min(path.prixHT, 0, { message: 'Le prix ne peut pas être négatif.' });
    min(path.quantite, 0, { message: 'La quantité ne peut pas être négative.' });
    min(path.tva, 0, { message: 'La TVA ne peut pas être négative.' });
  });

  private readonly quantiteEffective = computed(() => Math.max(this.valeurs().quantite, 0));

  protected readonly tauxRemise = computed(() => {
    // « entre 10 et 15 » est pris au sens inclusif : la quantité 10 ouvre droit à 20 %.
    // La capture du sujet affiche $0.00 pour 10, mais l'énoncé écrit prévaut car ses
    // bornes sont explicites ; les seuils restent des constantes nommées.
    const quantite = this.quantiteEffective();
    if (quantite >= REMISE_SEUIL_MIN && quantite <= REMISE_SEUIL_MAX) {
      return TAUX_REMISE_INTERMEDIAIRE;
    }
    if (quantite > REMISE_SEUIL_MAX) {
      return TAUX_REMISE_IMPORTANTE;
    }
    return TAUX_SANS_REMISE;
  });

  protected readonly prixUnitaireTtc = computed(() => {
    const { prixHT, tva } = this.valeurs();
    if (prixHT < 0 || tva < 0) {
      return 0;
    }
    return prixHT * (1 + tva / 100);
  });

  protected readonly remise = computed(
    () => this.prixUnitaireTtc() * this.quantiteEffective() * this.tauxRemise(),
  );

  protected readonly prixTotalTtc = computed(
    () => this.prixUnitaireTtc() * this.quantiteEffective() - this.remise(),
  );
}
