import { Component, DestroyRef, inject, signal } from '@angular/core';
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
import { CreatedBlog } from './add-blog';
import { BlogStore } from './state';

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
})
export default class AddBlogPage {
  destroyRef = inject(DestroyRef);
  #blogStateService = inject(BlogStore);
  submitButtonDisabled = signal<boolean>(false);

  protected state = this.#blogStateService.state;

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
    this.formTyped.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        console.log('Form value changed:', value);
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
      setTimeout(() => {
        if (control.value === 'Test Async') {
          resolve({ customAsync: true });
        }
        resolve(null);
      });
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
