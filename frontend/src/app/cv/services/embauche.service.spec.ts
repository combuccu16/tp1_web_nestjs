import { TestBed } from '@angular/core/testing';
import { Cv } from '../model/cv';
import { EmbaucheService, MAX_EMBAUCHES } from './embauche.service';

describe('EmbaucheService', () => {
  let service: EmbaucheService;
  const cvs = [
    new Cv(1, 'One', 'Test', 20, '1', 'Job', ''),
    new Cv(2, 'Two', 'Test', 21, '2', 'Job', ''),
    new Cv(3, 'Three', 'Test', 22, '3', 'Job', ''),
    new Cv(4, 'Four', 'Test', 23, '4', 'Job', ''),
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmbaucheService);
  });

  it('adds a CV once and rejects duplicates', () => {
    expect(service.embaucher(cvs[0])).toBe(true);
    expect(service.embaucher(cvs[0])).toBe(false);
    expect(service.getEmbauchees()).toHaveLength(1);
  });

  it('marks the budget as exceeded only after the fourth hire', () => {
    for (const cv of cvs.slice(0, MAX_EMBAUCHES)) {
      service.embaucher(cv);
    }

    expect(service.budgetDepasse()).toBe(false);
    service.embaucher(cvs[3]);
    expect(service.budgetDepasse()).toBe(true);
  });
});
