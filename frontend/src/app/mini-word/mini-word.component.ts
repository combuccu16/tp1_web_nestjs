import { Component, signal } from '@angular/core';
import { form, FormField, min } from '@angular/forms/signals';

@Component({
  imports: [FormField],
  selector: 'app-mini-word',
  styleUrl: './mini-word.component.css',
  templateUrl: './mini-word.component.html',
})
export class MiniWordComponent {
  protected readonly fonts = ['Arial', 'Verdana', 'Times New Roman', 'Courier New', 'Georgia'];

  protected readonly style = signal({ color: '#000000', size: 30, font: 'Arial' });

  protected readonly styleForm = form(this.style, (path) => {
    min(path.size, 1, { message: 'La taille doit être au moins 1 px.' });
  });
}
