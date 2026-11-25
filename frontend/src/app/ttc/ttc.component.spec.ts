import { TestBed } from '@angular/core/testing';
import { TtcComponent } from './ttc.component';

describe('TtcComponent (Signal Forms + computed)', () => {
  function setup() {
    const fixture = TestBed.createComponent(TtcComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const [prix, quantite, tva] = [...el.querySelectorAll<HTMLInputElement>('input')];
    const results = () =>
      [...el.querySelectorAll('.ttc__result strong')].map((node) => node.textContent?.trim());
    const type = (input: HTMLInputElement, value: string) => {
      input.value = value;
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();
    };
    return { el, prix, quantite, tva, results, type };
  }

  it('starts with quantity 1, price 0 and VAT 18', () => {
    const { prix, quantite, tva, results } = setup();
    expect([prix.value, quantite.value, tva.value]).toEqual(['0', '1', '18']);
    expect(results()).toEqual(['$0.00', '$0.00', '$0.00']);
  });

  it('recomputes the TTC prices and discounts when the inputs change', () => {
    const { prix, quantite, results, type } = setup();
    type(prix, '100');
    expect(results()).toEqual(['$118.00', '$0.00', '$118.00']);

    type(quantite, '12');
    expect(results()).toEqual(['$118.00', '$283.20', '$1,132.80']);

    type(quantite, '20');
    expect(results()).toEqual(['$118.00', '$708.00', '$1,652.00']);
  });

  it('shows an error for a negative value', () => {
    const { el, prix, type } = setup();
    type(prix, '-5');
    expect(el.querySelector('[role="alert"]')?.textContent).toContain('négatif');
  });
});
