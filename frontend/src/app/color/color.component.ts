import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RainbowDirective } from '../rainbow/rainbow.directive';

@Component({
  imports: [FormsModule, RainbowDirective],
  selector: 'app-color',
  styleUrl: './color.component.css',
  templateUrl: './color.component.html',
})
export class ColorComponent {
  readonly DEFAULT_COLOR = 'red';
  color = '';

  resetColor(): void {
    this.color = '';
  }
}
