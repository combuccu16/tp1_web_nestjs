import { NgStyle } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule, NgStyle],
  selector: 'app-mini-word',
  styleUrl: './mini-word.component.css',
  templateUrl: './mini-word.component.html',
})
export class MiniWordComponent {
  protected color = '#000000';
  protected size = 30;
  protected font = 'Arial';

  protected readonly fonts = ['Arial', 'Verdana', 'Times New Roman', 'Courier New', 'Georgia'];
}
