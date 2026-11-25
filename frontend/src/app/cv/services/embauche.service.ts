import { Service, signal } from '@angular/core';
import { Cv } from '../model/cv';

export const MAX_EMBAUCHES = 3;

@Service()
export class EmbaucheService {
  private readonly embauchees = signal<Cv[]>([]);
  readonly embaucheesState = this.embauchees.asReadonly();

  getEmbauchees(): Cv[] {
    return [...this.embauchees()];
  }

  embaucher(cv: Cv): boolean {
    if (this.embauchees().some((embauchee) => embauchee.id === cv.id)) {
      return false;
    }

    this.embauchees.update((embauchees) => [...embauchees, cv]);
    return true;
  }

  budgetDepasse(): boolean {
    return this.embauchees().length > MAX_EMBAUCHES;
  }
}
