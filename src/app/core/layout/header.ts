import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'BlogHeader',
  template: `
    <mat-toolbar color="primary" class="header-toolbar">
      <span>Blog App</span>
      <span class="spacer"></span>
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
        .spacer {
          flex: 1;
        }
      }
    `,
  ],
  imports: [MatToolbarModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {}
