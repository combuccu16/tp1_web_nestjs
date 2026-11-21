import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: 'input[appRainbow], textarea[appRainbow]',
  standalone: true,
})
export class RainbowDirective {
  @HostBinding('style.color')
  color = 'black';

  @HostBinding('style.borderColor')
  borderColor = 'black';

  @HostListener('keyup')
  onKeyup(): void {
    this.color = this.randomColor();
    this.borderColor = this.randomColor();
  }

  private randomColor(): string {
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);
    return `rgb(${red}, ${green}, ${blue})`;
  }
}
