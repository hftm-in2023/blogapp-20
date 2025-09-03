import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatProgressBar } from '@angular/material/progress-bar';
import { RouterStore } from './core/state/router';
import { HeaderComponent } from './core/layout/header';

@Component({
  selector: 'App',
  imports: [RouterOutlet, HeaderComponent, MatProgressBar],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  isLoading = inject(RouterStore).isLoading;

  onModeChange($event: string) {
    console.log(`event fired ${$event}`);
  }
  protected title = 'blogapp-20';
}
