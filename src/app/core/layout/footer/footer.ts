import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, TranslatePipe],
  styles: `
    :host {
      display: block;
    }

    .editorial-footer {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding: 1.5rem;
      background: var(--mat-sys-surface);
      border-top: 1px solid var(--mat-sys-surface-container-high);
    }

    .footer-top {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .footer-brand {
      font-family: var(--editorial-serif);
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--mat-sys-on-surface);
      flex-shrink: 0;
    }

    .footer-links {
      display: flex;
      flex-wrap: wrap;
      margin-left: auto;
      gap: 0.5rem 1.5rem;

      a {
        font-family: var(--editorial-sans);
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--mat-sys-on-surface-variant);
        text-decoration: none;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        transition: color 0.15s ease;

        &:hover {
          color: var(--mat-sys-on-surface);
        }
      }
    }

    .footer-icons {
      display: flex;
      gap: 0.75rem;
      flex-shrink: 0;
      color: var(--mat-sys-on-surface-variant);

      mat-icon {
        font-size: 1.25rem;
        width: 1.25rem;
        height: 1.25rem;
      }
    }

    .footer-copyright {
      font-family: var(--editorial-sans);
      font-size: 0.6875rem;
      color: var(--mat-sys-on-surface-variant);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    @media (max-width: 600px) {
      .editorial-footer {
        align-items: center;
        text-align: center;
      }

      .footer-top {
        flex-direction: column;
        align-items: center;
      }

      .footer-brand,
      .footer-icons {
        display: none;
      }

      .footer-links {
        margin-left: 0;
        justify-content: center;
      }
    }
  `,
  template: `
    <footer class="editorial-footer">
      <div class="footer-top">
        <div class="footer-brand">The Record</div>
        <nav class="footer-links">
          <a href="#">{{ 'FOOTER.ABOUT' | translate }}</a>
          <a href="#">{{ 'FOOTER.PRIVACY' | translate }}</a>
          <a href="#">{{ 'FOOTER.TERMS' | translate }}</a>
          <a href="#">{{ 'FOOTER.ARCHIVE' | translate }}</a>
          <a href="#">{{ 'FOOTER.CAREERS' | translate }}</a>
        </nav>
        <div class="footer-icons">
          <mat-icon>language</mat-icon>
          <mat-icon>mail</mat-icon>
        </div>
      </div>
      <div class="footer-copyright">{{ 'FOOTER.COPYRIGHT' | translate }}</div>
    </footer>
  `,
})
export class FooterComponent {}
