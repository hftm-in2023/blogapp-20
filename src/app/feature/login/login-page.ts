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
import { MatIconModule } from '@angular/material/icon';
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
    MatIconModule,
    TranslatePipe,
  ],
  template: `
    <div class="login-page">
      <div class="login-card">
        <div class="login-header">
          <h1 class="login-brand">The Record</h1>
          <p class="login-tagline">{{ 'LOGIN.TITLE' | translate }}</p>
        </div>

        @if (authStore.error()) {
          <div class="error-message">
            <mat-icon class="error-icon">error_outline</mat-icon>
            {{ authStore.error() }}
          </div>
        }

        <form (submit)="onSubmit($event)" class="login-form">
          <mat-form-field appearance="outline">
            <mat-label>{{ 'LOGIN.USERNAME' | translate }}</mat-label>
            <input matInput [formField]="loginForm.username" />
            <mat-icon matPrefix>person_outline</mat-icon>
            <mat-error>
              @for (error of loginForm.username().errors(); track error.kind) {
                <span>{{ error.message }}</span>
              }
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>{{ 'LOGIN.PASSWORD' | translate }}</mat-label>
            <input matInput type="password" [formField]="loginForm.password" />
            <mat-icon matPrefix>lock_outline</mat-icon>
            <mat-error>
              @for (error of loginForm.password().errors(); track error.kind) {
                <span>{{ error.message }}</span>
              }
            </mat-error>
          </mat-form-field>

          <button
            type="submit"
            class="login-submit-btn"
            mat-flat-button
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
    </div>
  `,
  styles: `
    .login-page {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: calc(100vh - 128px);
      padding: 2rem;
    }

    .login-card {
      width: 100%;
      max-width: 420px;
      background: var(--mat-sys-surface-container-lowest);
      border-radius: 0.75rem;
      padding: 2.5rem;
    }

    .login-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .login-brand {
      font-family: var(--editorial-serif);
      font-size: 2rem;
      font-weight: 700;
      color: var(--mat-sys-on-surface);
      margin: 0 0 0.5rem;
      letter-spacing: -0.02em;
    }

    .login-tagline {
      font-family: var(--editorial-sans);
      font-size: 0.9375rem;
      color: var(--mat-sys-on-surface-variant);
      margin: 0;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--mat-sys-error);
      margin-bottom: 1.5rem;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      background: var(--mat-sys-error-container);
      font-family: var(--editorial-sans);
      font-size: 0.875rem;
    }

    .error-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .login-submit-btn {
      width: 100%;
      height: 48px;
      margin-top: 0.5rem;
      font-family: var(--editorial-sans);
      font-size: 0.9375rem;
      font-weight: 600;
      background: var(--mat-sys-on-surface) !important;
      color: var(--mat-sys-surface) !important;
      border-radius: 999px;
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
