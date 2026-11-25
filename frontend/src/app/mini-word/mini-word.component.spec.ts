import { TestBed } from '@angular/core/testing';
import { MiniWordComponent } from './mini-word.component';

describe('MiniWordComponent (Signal Forms + style bindings)', () => {
  it('applies the color, size and font chosen in the controls to the paragraph', () => {
    const fixture = TestBed.createComponent(MiniWordComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const paragraph = el.querySelector('p')!;

    expect(paragraph.style.fontSize).toBe('30px');
    expect(paragraph.style.fontFamily).toBe('Arial');

    const color = el.querySelector<HTMLInputElement>('input[type="color"]')!;
    color.value = '#ff0000';
    color.dispatchEvent(new Event('input'));

    const size = el.querySelector<HTMLInputElement>('input[type="number"]')!;
    size.value = '42';
    size.dispatchEvent(new Event('input'));

    const font = el.querySelector('select')!;
    font.value = 'Georgia';
    font.dispatchEvent(new Event('input'));
    font.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(paragraph.style.color).toBe('rgb(255, 0, 0)');
    expect(paragraph.style.fontSize).toBe('42px');
    expect(paragraph.style.fontFamily).toBe('Georgia');
  });
});
