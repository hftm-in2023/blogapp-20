import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { form, FormField, required, submit } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthStore } from '../../core/auth';

@Component({
  selector: 'app-login',
  imports: [
    FormField,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    TranslatePipe,
  ],
  template: `
    <div class="login-container">
      <h2>{{ 'LOGIN.TITLE' | translate }}</h2>

      @if (authStore.error()) {
        <div class="error-message">{{ authStore.error() }}</div>
      }

      <form (submit)="onSubmit($event)">
        <mat-form-field appearance="fill">
          <mat-label>{{ 'LOGIN.USERNAME' | translate }}</mat-label>
          <input matInput [formField]="loginForm.username" />
          <mat-error>
            @for (error of loginForm.username().errors(); track error.kind) {
              <span>{{ error.message }}</span>
            }
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>{{ 'LOGIN.PASSWORD' | translate }}</mat-label>
          <input matInput type="password" [formField]="loginForm.password" />
          <mat-error>
            @for (error of loginForm.password().errors(); track error.kind) {
              <span>{{ error.message }}</span>
            }
          </mat-error>
        </mat-form-field>

        <button
          type="submit"
          mat-flat-button
          color="primary"
          [disabled]="authStore.loading()"
        >
          @if (authStore.loading()) {
            <mat-spinner diameter="20" />
          } @else {
            {{ 'LOGIN.SUBMIT' | translate }}
          }
        </button>
      </form>
    </div>
  `,
  styles: `
    .login-container {
      max-width: 400px;
      margin: 2rem auto;
      padding: 2rem;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .error-message {
      color: var(--mat-sys-error);
      margin-bottom: 1rem;
      padding: 0.5rem;
      border-radius: 4px;
      background: var(--mat-sys-error-container);
    }

    button {
      align-self: flex-start;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginPage {
  readonly authStore = inject(AuthStore);
  readonly #router = inject(Router);
  readonly #route = inject(ActivatedRoute);

  protected readonly loginModel = signal<{
    username: string;
    password: string;
  }>({
    username: '',
    password: '',
  });

  protected readonly loginForm = form(this.loginModel, (s) => {
    required(s.username, { message: 'Username is required' });
    required(s.password, { message: 'Password is required' });
  });

  onSubmit(event: Event) {
    event.preventDefault();
    submit(this.loginForm, async () => {
      const { username, password } = this.loginModel();
      const success = await this.authStore.login(username, password);
      if (success) {
        const returnUrl =
          this.#route.snapshot.queryParams['returnUrl'] || '/overview';
        this.#router.navigateByUrl(returnUrl);
      }
    });
  }
}
