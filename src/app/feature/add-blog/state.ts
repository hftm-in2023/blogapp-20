import { inject, Injectable, signal } from '@angular/core';
import { AddBlogService, CreatedBlog } from './add-blog';
import { Router } from '@angular/router';
import { Dispatcher } from '../../core/events/dispatcher';

type BlogState = {
  error?: string;
};

@Injectable({
  providedIn: 'root',
})
export class BlogStore {
  readonly #state = signal<BlogState>({ error: undefined });
  readonly #blogService = inject(AddBlogService);
  readonly #router = inject(Router);
  readonly #dispatcher = inject(Dispatcher);

  //exposed state
  state = this.#state.asReadonly();

  async addBlog(blog: CreatedBlog) {
    this.#state.set({ error: undefined });

    try {
      this.#dispatcher.dispatch({
        type: 'SET_LOADING_STATE',
        payload: { isLoading: true },
      });
      await this.#blogService.addBlog(blog);
      this.#router.navigate(['/overview']);
    } catch (error) {
      this.#dispatcher.dispatch({
        type: 'SET_LOADING_STATE',
        payload: { isLoading: false },
      });
      this.#state.update((state) => ({
        ...state,
        error: (error as Error).message,
      }));
    }
  }
}
