import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'BlogHeader',
  template: `
    <mat-toolbar color="primary" class="header-toolbar">
      <span>Blog App</span>
      <span class="spacer"></span>

      @if (canAddBlog()) {
        <button
          class="add-blog"
          mat-raised-button
          color="accent"
          routerLink="/add-blog"
        >
          Neuen Blog erstellen
        </button>
      }

      @if (isAuthenticated()) {
        <div
          id="profileImage"
          matTooltip="{{ userData()?.preferred_username }}"
          [innerHTML]="initials()"
        ></div>
        <button
          data-testid="logout-button"
          mat-icon-button
          matTooltip="Logout"
          class="example-icon favorite-icon"
          aria-label="Logout button"
          (click)="logout.emit()"
        >
          <mat-icon>logout</mat-icon>
        </button>
      } @else {
        <button
          data-testid="login-button"
          mat-icon-button
          matTooltip="Login"
          class="example-icon favorite-icon"
          aria-label="Login button"
          (click)="login.emit()"
        >
          <mat-icon>login</mat-icon>
        </button>
      }
    </mat-toolbar>
  `,
  styles: [
    `
      :host {
        height: 4rem;
        display: block;

        .header-toolbar {
          display: flex;
          justify-content: space-between;
          padding: 0 1rem;
          position: fixed;
          z-index: 1000;
        }

        #profileImage {
          width: 2.1875rem;
          height: 2.1875rem;
          border-radius: 20px;
          background: var(--mat-sys-primary);
          font-size: 0.9rem;
          color: var(--mat-sys-on-primary);
          text-align: center;
          line-height: 2.1875rem;
          text-transform: uppercase;
          cursor: pointer;
        }

        .add-blog {
          margin-right: 1rem;
        }

        .spacer {
          flex: 1;
        }
      }
    `,
  ],
  imports: [
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  isAuthenticated = input.required<boolean>();
  roles = input.required<string[] | null>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userData = input.required<any>();

  login = output<void>();
  logout = output<void>();

  initials = computed(
    () =>
      this.userData()
        ?.preferred_username.split(/[._-]/)
        .map((token: string) => token.charAt(0))
        .join('') as string,
  );

  canAddBlog = computed(() => {
    const authenticated = this.isAuthenticated();
    const roles = this.roles();
    return authenticated && roles?.includes('user');
  });
}
