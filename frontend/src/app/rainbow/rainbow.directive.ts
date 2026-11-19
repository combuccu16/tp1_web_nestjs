import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: 'input[appRainbow], textarea[appRainbow]',
  standalone: true,
})
export class RainbowDirective {
  @HostBinding('style.color')
  color = '';

  @HostBinding('style.borderColor')
  borderColor = '';

  @HostListener('keyup')
  onKeyup(): void {
    const color = this.randomColor();
    this.color = color;
    this.borderColor = color;
  }

  private randomColor(): string {
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);
    return `rgb(${red}, ${green}, ${blue})`;
  }
}
