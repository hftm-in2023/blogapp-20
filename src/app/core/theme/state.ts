import { computed, effect, Injectable, signal } from '@angular/core';
import { storeLogger } from '../dev-tools';

type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'blog-app-theme';

function getInitialTheme(): ThemeMode {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

@Injectable({ providedIn: 'root' })
export class ThemeStore {
  // state
  readonly #mode = signal<ThemeMode>(getInitialTheme());

  // selectors
  readonly mode = this.#mode.asReadonly();
  readonly isDarkMode = computed(() => this.#mode() === 'dark');

  constructor() {
    storeLogger.attachState(this.mode, { name: 'ThemeStore' });

    effect(() => {
      const current = this.#mode();
      if (current === 'dark') {
        document.documentElement.classList.add('dark-mode');
      } else {
        document.documentElement.classList.remove('dark-mode');
      }
      localStorage.setItem(STORAGE_KEY, current);
    });
  }

  // actions
  toggleTheme(): void {
    this.#mode.update((m) => (m === 'light' ? 'dark' : 'light'));
  }

  setTheme(mode: ThemeMode): void {
    this.#mode.set(mode);
  }
}
