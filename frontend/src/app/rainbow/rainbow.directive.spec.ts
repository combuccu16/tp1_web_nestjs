import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RainbowDirective } from './rainbow.directive';

@Component({
  imports: [RainbowDirective],
  template: '<input appRainbow /><textarea appRainbow></textarea><div appRainbow></div>',
})
class RainbowDirectiveHostComponent {}

describe('RainbowDirective', () => {
  it('changes supported controls on keyup but does not style other elements', async () => {
    await TestBed.configureTestingModule({
      imports: [RainbowDirectiveHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(RainbowDirectiveHostComponent);
    fixture.detectChanges();

    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    const textarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
    const div: HTMLDivElement = fixture.nativeElement.querySelector('div');

    input.dispatchEvent(new KeyboardEvent('keyup'));
    textarea.dispatchEvent(new KeyboardEvent('keyup'));
    div.dispatchEvent(new KeyboardEvent('keyup'));
    fixture.detectChanges();

    expect(input.style.color).toMatch(/^rgb\(\d+, \d+, \d+\)$/);
    expect(input.style.borderColor).toBe(input.style.color);
    expect(textarea.style.color).toMatch(/^rgb\(\d+, \d+, \d+\)$/);
    expect(textarea.style.borderColor).toBe(textarea.style.color);
    expect(div.style.color).toBe('');
    expect(div.style.borderColor).toBe('');
  });
});
