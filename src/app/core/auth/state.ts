import { computed, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { storeLogger } from '../dev-tools';

type UserInfo = {
  preferred_username: string;
  email: string;
  name: string;
  roles: string[];
};

type AuthState = {
  isAuthenticated: boolean;
  user: UserInfo | null;
  loading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null,
};

@Injectable({ providedIn: 'root' })
export class AuthStore {
  readonly #state = signal<AuthState>(initialState);

  // selectors
  isAuthenticated = computed(() => this.#state().isAuthenticated);
  userData = computed(() => this.#state().user);
  loading = computed(() => this.#state().loading);
  error = computed(() => this.#state().error);

  roles = computed(() => {
    const user = this.#state().user;
    return user?.roles ?? null;
  });

  constructor() {
    storeLogger.attachState(this.#state, { name: 'AuthStore' });
    this.checkSession();
  }

  async checkSession(): Promise<void> {
    try {
      const res = await fetch(`${environment.bffUrl}/auth/me`, {
        credentials: 'include',
      });
      const data = await res.json();
      this.#state.set({
        isAuthenticated: data.isAuthenticated,
        user: data.user,
        loading: false,
        error: null,
      });
    } catch {
      this.#state.set({ ...initialState, loading: false });
    }
  }

  async login(username: string, password: string): Promise<boolean> {
    this.#state.update((s) => ({ ...s, loading: true, error: null }));

    try {
      const res = await fetch(`${environment.bffUrl}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        this.#state.update((s) => ({
          ...s,
          loading: false,
          error: data.error || 'Login failed',
        }));
        return false;
      }

      this.#state.set({
        isAuthenticated: true,
        user: data.user,
        loading: false,
        error: null,
      });
      return true;
    } catch {
      this.#state.update((s) => ({
        ...s,
        loading: false,
        error: 'Network error',
      }));
      return false;
    }
  }

  async logout(): Promise<void> {
    try {
      await fetch(`${environment.bffUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
    } catch {
      // ignore logout errors
    }

    this.#state.set({ ...initialState, loading: false });
  }
}
