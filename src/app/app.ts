import { Component } from '@angular/core';
import { Demo } from './core/demo/demo';

@Component({
  selector: 'App',
  imports: [Demo],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  onModeChange($event: string) {
    console.log(`event fired ${$event}`);
  }
  protected title = 'blogapp-20';
}
