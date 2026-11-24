import { Component, signal } from '@angular/core';
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
  color = signal(this.DEFAULT_COLOR);

  resetColor(): void {
    this.color.set(this.DEFAULT_COLOR);
  }
}
