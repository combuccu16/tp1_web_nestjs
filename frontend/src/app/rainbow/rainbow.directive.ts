import { Directive, HostBinding, HostListener, signal } from '@angular/core';

@Directive({
  selector: 'input[appRainbow]',
  host: {
    '[style.color]': 'color()',
    '[style.borderColor]': 'color()',
    '(keyup)': 'onKeyUp()'
  },
  standalone: true,
})
export class RainbowDirective {
  color = signal(this.randomColor());

  onKeyUp(): void {
    this.color.set(this.randomColor());
  }

  private randomColor(): string {
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);
    return `rgb(${red}, ${green}, ${blue})`;
  }
}
