import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CreatedBlog } from './add-blog-backend';
import { BlogStore } from './state';
import { Dispatcher } from '../../core/events/dispatcher';

@Component({
  selector: 'app-add-blog',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './add-blog-page.html',
  styleUrl: './add-blog-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AddBlogPage {
  readonly #destroyRef = inject(DestroyRef);
  readonly #blogStateService = inject(BlogStore);
  readonly #dispatcher = inject(Dispatcher);

  // properties used in template
  protected readonly submitButtonDisabled = signal<boolean>(false);
  protected readonly state = this.#blogStateService.state;

  formTyped = new FormGroup<{
    title: FormControl<string>;
    content: FormControl<string>;
  }>({
    title: new FormControl<string>('an exiting title', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern('^[A-Z]+(.)*'),
        this.customVaidator,
      ],
      asyncValidators: [this.customAsyncValidator],
    }),
    content: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
      asyncValidators: [],
    }),
  });

  constructor() {
    // Auf Wertänderungen reagieren
    this.formTyped.valueChanges
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((value) => {
        console.log('Form value changed:', value);
        // Hier kannst du auf Änderungen reagieren
      });

    // Auf Status-Änderungen reagieren
    this.formTyped.statusChanges
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((status) => {
        console.log('Form status changed:', status);
        // Status: VALID, INVALID, PENDING, DISABLED
        if (status === 'PENDING') {
          this.#dispatcher.dispatch({
            type: 'SET_LOADING_STATE',
            payload: { isLoading: true },
          });
        } else {
          this.#dispatcher.dispatch({
            type: 'SET_LOADING_STATE',
            payload: { isLoading: false },
          });
        }
      });
  }

  customVaidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value && value === 'Test') {
      return { custom: true };
    }
    return null;
  }

  customAsyncValidator(
    control: AbstractControl,
  ): Promise<ValidationErrors | null> {
    return new Promise((resolve) => {
      // Simuliere Server-Anfrage mit Verzögerung
      setTimeout(() => {
        if (control.value === 'Test Async') {
          resolve({ customAsync: true });
        } else {
          resolve(null);
        }
      }, 1000); // 1 Sekunde Verzögerung
    });
  }

  onSubmit() {
    if (this.formTyped.valid) {
      this.submitButtonDisabled.set(true);
      const blogData = this.formTyped.value;
      console.log('Blog submitted:', blogData);
      this.#blogStateService.addBlog(blogData as CreatedBlog);
    } else {
      console.log('Form is invalid');
    }
  }
}
