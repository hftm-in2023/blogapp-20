import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthStore } from './core/auth';
import { SidebarComponent } from './core/layout';

@Component({
  selector: 'app-root',
  imports: [SidebarComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly #authStore = inject(AuthStore);
  readonly #router = inject(Router);

  onModeChange($event: string) {
    console.log(`event fired ${$event}`);
  }
  protected title = 'blogapp-20';

  isAuthenticated = this.#authStore.isAuthenticated;
  userData = this.#authStore.userData;
  roles = this.#authStore.roles;

  login() {
    this.#router.navigate(['/login']);
  }

  async logout() {
    await this.#authStore.logout();
    this.#router.navigate(['/']);
  }
}
