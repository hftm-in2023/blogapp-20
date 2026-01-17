import { computed, effect, Injectable, signal } from '@angular/core';
import { storeLogger } from '../dev-tools';

export type ThemeMode = 'light' | 'dark';

const THEME_STORAGE_KEY = 'app-theme-mode';

@Injectable({ providedIn: 'root' })
export class ThemeStore {
  // state
  readonly #themeMode = signal<ThemeMode>(this.#getInitialTheme());

  // selectors
  readonly themeMode = computed(() => this.#themeMode());
  readonly isDarkMode = computed(() => this.#themeMode() === 'dark');

  constructor() {
    storeLogger.attachState(this.themeMode, { name: 'ThemeStore' });

    // Apply initial theme immediately
    this.#applyTheme(this.#themeMode());

    // Apply theme to document and persist changes
    effect(() => {
      const mode = this.themeMode();
      console.log('Theme effect triggered, mode:', mode);
      console.log(
        'Applying theme class:',
        mode === 'dark' ? 'adding dark-theme' : 'removing dark-theme',
      );
      this.#applyTheme(mode);
      this.#persistTheme(mode);
    });
  }

  // actions
  setTheme(mode: ThemeMode): void {
    this.#themeMode.set(mode);
  }

  toggleTheme(): void {
    const newMode = this.#themeMode() === 'light' ? 'dark' : 'light';
    this.setTheme(newMode);
  }

  // private methods
  #getInitialTheme(): ThemeMode {
    // Check localStorage first
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }

    // Fall back to system preference
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return 'dark';
    }

    return 'light';
  }

  #applyTheme(mode: ThemeMode): void {
    const htmlElement = document.documentElement;
    console.log('Before apply - classList:', htmlElement.classList.toString());
    console.log('Mode to apply:', mode);

    if (mode === 'dark') {
      htmlElement.classList.add('dark-theme');
      console.log('Added dark-theme class');
    } else {
      htmlElement.classList.remove('dark-theme');
      console.log('Removed dark-theme class');
    }

    console.log('After apply - classList:', htmlElement.classList.toString());
    console.log(
      'Computed style background:',
      getComputedStyle(document.body).backgroundColor,
    );
  }

  #persistTheme(mode: ThemeMode): void {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  }
}
