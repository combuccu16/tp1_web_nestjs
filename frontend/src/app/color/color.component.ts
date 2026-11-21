import { Component } from '@angular/core';
import { RainbowDirective } from '../rainbow/rainbow.directive';

@Component({
  imports: [RainbowDirective],
  selector: 'app-color',
  styleUrl: './color.component.css',
  templateUrl: './color.component.html',
})
export class ColorComponent {
  readonly DEFAULT_COLOR = '#ffffff';
  color = this.DEFAULT_COLOR;

  resetColor(input: HTMLInputElement): void {
    this.color = this.DEFAULT_COLOR;
    input.value = '';
  }
}
