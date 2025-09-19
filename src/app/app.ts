import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatProgressBar } from '@angular/material/progress-bar';
import { RouterStore } from './core/state/router';
import { HeaderComponent } from './core/layout/header';
import { AuthStore } from './core/auth';

@Component({
  selector: 'App',
  imports: [RouterOutlet, HeaderComponent, MatProgressBar],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  isLoading = inject(RouterStore).isLoading;
  readonly #authStore = inject(AuthStore);

  onModeChange($event: string) {
    console.log(`event fired ${$event}`);
  }
  protected title = 'blogapp-20';

  isAuthenticated = this.#authStore.isAuthenticated;
  userData = this.#authStore.userData;
  roles = this.#authStore.roles;

  login() {
    this.#authStore.login();
  }

  logout() {
    this.#authStore.logout();
  }
}
