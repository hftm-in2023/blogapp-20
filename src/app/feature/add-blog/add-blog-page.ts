import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  resource,
  signal,
  untracked,
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
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { CreatedBlog } from './add-blog-backend';
import { BlogStore } from './state';
import { Dispatcher } from '../../core/events';

@Component({
  selector: 'app-add-blog',
  imports: [
    FormField,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    TranslatePipe,
  ],
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
  protected readonly blogModel = signal<{
    title: string;
    content: string;
    headerImageUrl: string;
  }>({
    title: 'an exiting title',
    content: '',
    headerImageUrl: '',
  });

  protected readonly imagePreview = computed(
    () => this.blogModel().headerImageUrl,
  );

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
      untracked(() => {
        this.#dispatcher.dispatch({
          type: 'SET_LOADING_STATE',
          payload: { isLoading: isPending },
        });
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
    this.blogModel.set({
      title: 'an exiting title',
      content: '',
      headerImageUrl: '',
    });
    this.blogForm().reset();
  }

  protected onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.blogModel.update((m) => ({
        ...m,
        headerImageUrl: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  }

  protected removeImage(): void {
    this.blogModel.update((m) => ({ ...m, headerImageUrl: '' }));
  }
}
