import { Component, model } from '@angular/core';
import {
  ProgressBarMode,
  MatProgressBarModule,
} from '@angular/material/progress-bar';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'Demo',
  imports: [
    MatCardModule,
    MatRadioModule,
    FormsModule,
    MatSliderModule,
    MatProgressBarModule,
  ],
  templateUrl: './demo.html',
  styleUrl: './demo.scss',
})
export class Demo {
  mode = model<ProgressBarMode>('determinate');
  value = model<number>();
  bufferValue = 75;
}
