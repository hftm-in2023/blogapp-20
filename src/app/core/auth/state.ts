import { computed, inject, Injectable } from '@angular/core';
import { LoginResponse, OidcSecurityService } from 'angular-auth-oidc-client';
import { toSignal } from '@angular/core/rxjs-interop';
import { lastValueFrom } from 'rxjs';
import { storeLogger } from '../dev-tools';

//inital state
const initialState = { isAuthenticated: false } as LoginResponse;

@Injectable({ providedIn: 'root' })
export class AuthStore {
  readonly #oidcSecurityService = inject(OidcSecurityService);

  // state
  readonly #authentication = toSignal(this.#oidcSecurityService.checkAuth(), {
    initialValue: initialState,
  });

  // selectors
  isAuthenticated = computed(() => this.#authentication().isAuthenticated);
  userData = computed(() => this.#authentication().userData);
  auth = computed(() => this.#authentication());

  constructor() {
    storeLogger.attachState(this.auth, { name: 'AuthStore' });
  }

  // actions
  login() {
    this.#oidcSecurityService.authorize();
  }

  logout() {
    return lastValueFrom(this.#oidcSecurityService.logoff());
  }
}
