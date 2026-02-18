import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  resource,
  signal,
} from '@angular/core';
import {
  form,
  FormField,
  required,
  pattern,
  validate,
  validateAsync,
  submit,
} from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CreatedBlog } from './add-blog-backend';
import { BlogStore } from './state';
import { Dispatcher } from '../../core/events/dispatcher';

@Component({
  selector: 'app-add-blog',
  imports: [FormField, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './add-blog-page.html',
  styleUrl: './add-blog-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AddBlogPage {
  readonly #blogStateService = inject(BlogStore);
  readonly #dispatcher = inject(Dispatcher);

  // Properties used in template
  protected readonly submitButtonDisabled = signal<boolean>(false);
  protected readonly state = this.#blogStateService.state;

  // Form model signal (single source of truth)
  protected readonly blogModel = signal<{ title: string; content: string }>({
    title: 'an exiting title',
    content: '',
  });

  // Signal form with schema-based validation
  protected readonly blogForm = form(this.blogModel, (s) => {
    // Title validators
    required(s.title, { message: 'Title should not be empty' });
    pattern(s.title, /^[A-Z]+(.)*/, { message: 'Not a valid Title' });

    validate(s.title, ({ value }) => {
      if (value() === 'Test') {
        return {
          kind: 'custom',
          message: "Custom error: Title cannot be 'Test'",
        };
      }
      return undefined;
    });

    validateAsync(s.title, {
      params: ({ value }) => value(),
      factory: (params) =>
        resource({
          params,
          loader: async ({ params: titleValue }) => {
            // Simulate server request with 1-second delay
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return titleValue === 'Test Async';
          },
        }),
      onSuccess: (isForbidden) => {
        if (isForbidden) {
          return {
            kind: 'customAsync',
            message: "Custom async error: Title cannot be 'Test Async'",
          };
        }
        return null;
      },
      onError: () => null,
    });

    // Content validators
    required(s.content, { message: 'Content should not be empty' });
  });

  constructor() {
    // React to value changes (replaces formTyped.valueChanges subscription)
    effect(() => {
      const value = this.blogModel();
      console.log('Form value changed:', value);
    });

    // React to status changes (replaces formTyped.statusChanges subscription)
    effect(() => {
      const isPending = this.blogForm().pending();
      const isValid = this.blogForm().valid();
      console.log(
        'Form status changed:',
        isPending ? 'PENDING' : isValid ? 'VALID' : 'INVALID',
      );
      this.#dispatcher.dispatch({
        type: 'SET_LOADING_STATE',
        payload: { isLoading: isPending },
      });
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();
    submit(this.blogForm, async () => {
      this.submitButtonDisabled.set(true);
      const blogData = this.blogModel();
      console.log('Blog submitted:', blogData);
      await this.#blogStateService.addBlog(blogData as CreatedBlog);
    });
  }

  onReset() {
    this.blogModel.set({ title: 'an exiting title', content: '' });
    this.blogForm().reset();
  }
}
