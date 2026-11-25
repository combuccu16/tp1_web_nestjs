import { Component, signal } from '@angular/core';
import { RainbowDirective } from '../rainbow/rainbow.directive';

export const DEFAULT_COLOR = '#ffffff';

@Component({
  imports: [RainbowDirective],
  selector: 'app-color',
  styleUrl: './color.component.css',
  templateUrl: './color.component.html',
})
export class ColorComponent {
  protected readonly color = signal(DEFAULT_COLOR);

  protected resetColor(input: HTMLInputElement): void {
    this.color.set(DEFAULT_COLOR);
    input.value = '';
  }
}
