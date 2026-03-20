import { Component, signal } from '@angular/core';
import {
  ProgressBarMode,
  MatProgressBarModule,
} from '@angular/material/progress-bar';
import { MatSliderModule } from '@angular/material/slider';
import { form, FormField } from '@angular/forms/signals';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-demo',
  imports: [
    MatCardModule,
    MatRadioModule,
    FormField,
    MatSliderModule,
    MatProgressBarModule,
  ],
  templateUrl: './demo.html',
  styleUrl: './demo.scss',
})
export default class Demo {
  protected readonly demoModel = signal<{
    mode: ProgressBarMode;
    value: number;
    bufferValue: number;
  }>({
    mode: 'determinate',
    value: 0,
    bufferValue: 75,
  });

  protected readonly demoForm = form(this.demoModel);
}
