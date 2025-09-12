import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type Action<T> = {
  type: string;
  payload: T;
};

export type Loading = {
  type: 'SET_LOADING_STATE';
  payload: { isLoading: boolean };
};

@Injectable({
  providedIn: 'root',
})
export class Dispatcher {
  readonly #dispatchQueue = new Subject<Action<unknown>>();

  readonly action$ = this.#dispatchQueue.asObservable();

  dispatch(action: Action<unknown>) {
    console.log('Dispatched action:', action);
    this.#dispatchQueue.next(action);
  }
}
