import { TestBed } from '@angular/core/testing';
import { ColorComponent } from './color.component';

describe('ColorComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorComponent],
    }).compileComponents();
  });

  it('updates the preview from the input and resets both input and preview', () => {
    const fixture = TestBed.createComponent(ColorComponent);
    fixture.detectChanges();

    const input: HTMLInputElement = fixture.nativeElement.querySelector('#color-input');
    const preview: HTMLElement = fixture.nativeElement.querySelector('.color-preview');
    expect(preview.style.backgroundColor).toBe('rgb(255, 255, 255)');

    input.value = 'blue';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(preview.style.backgroundColor).toBe('blue');

    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();
    expect(input.value).toBe('');
    expect(preview.style.backgroundColor).toBe('rgb(255, 255, 255)');
  });

  it('changes the input text and border colors on keyup', () => {
    const fixture = TestBed.createComponent(ColorComponent);
    fixture.detectChanges();

    const input: HTMLInputElement = fixture.nativeElement.querySelector('#color-input');
    input.dispatchEvent(new KeyboardEvent('keyup'));
    fixture.detectChanges();

    expect(input.style.color).toMatch(/^rgb\(\d+, \d+, \d+\)$/);
    expect(input.style.borderColor).toMatch(/^rgb\(\d+, \d+, \d+\)$/);
  });
});
