import { Directive, signal } from '@angular/core';

@Directive({
  selector: 'input[appRainbow], textarea[appRainbow]',
  host: {
    '[style.color]': 'color()',
    '[style.border-color]': 'borderColor()',
    '(keyup)': 'onKeyup()',
  },
})
export class RainbowDirective {
  protected readonly color = signal('black');
  protected readonly borderColor = signal('black');

  protected onKeyup(): void {
    this.color.set(this.randomColor());
    this.borderColor.set(this.randomColor());
  }

  private randomColor(): string {
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);
    return `rgb(${red}, ${green}, ${blue})`;
  }
}
