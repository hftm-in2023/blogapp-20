import { Injectable, computed, inject, signal } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { storeLogger } from '../dev-tools';
import { Dispatcher, Loading } from '../events/dispatcher';

type RouterState = {
  isLoading: boolean;
};

const initialState: RouterState = {
  isLoading: false,
};

@Injectable({
  providedIn: 'root',
})
export class RouterStore {
  readonly #router = inject(Router);
  readonly dispatcher = inject(Dispatcher);
  readonly #state = signal<RouterState>(initialState);

  readonly isLoading = computed(() => this.#state().isLoading);

  constructor() {
    storeLogger.attachState(this.#state, { name: 'RouterStore' });

    this.#router.events.subscribe((event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.#setLoadingState(true);
          break;
        }

        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.#setLoadingState(false);
          break;
        }
      }
    });

    this.dispatcher.action$.subscribe((action) => {
      if (action.type === 'SET_LOADING_STATE') {
        this.#setLoadingState((action as Loading).payload.isLoading);
      }
    });
  }

  #setLoadingState(value: boolean) {
    this.#state.update((state) => ({ ...state, isLoading: value }));
  }
}
