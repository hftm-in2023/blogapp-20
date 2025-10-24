import { Component, inject } from '@angular/core';
import { AuthStore } from './core/auth';
import { SidebarComponent } from './core/layout/sidebar/sidebar.component';

@Component({
  selector: 'App',
  imports: [SidebarComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
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
