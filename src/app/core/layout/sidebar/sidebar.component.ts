import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  Signal,
} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { map, shareReplay } from 'rxjs/operators';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MatProgressBar } from '@angular/material/progress-bar';
import { RouterStore } from '../../state/router';
import { ThemeStore } from '../../theme/theme.store';

@Component({
  selector: 'Sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    RouterOutlet,
    RouterLink,
    MatTooltipModule,
    TranslatePipe,
    MatProgressBar,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  readonly #breakpointObserver = inject(BreakpointObserver);
  readonly #translate = inject(TranslateService);
  protected readonly isLoading = inject(RouterStore).isLoading;
  protected readonly themeStore = inject(ThemeStore);

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

  isHandset = toSignal(
    this.#breakpointObserver.observe(Breakpoints.Handset).pipe(
      map((result) => result.matches),
      shareReplay(),
    ),
    { initialValue: false },
  ) as Signal<boolean>;

  changeLanguage(language: string) {
    this.#translate.use(language);
  }

  toggleTheme() {
    this.themeStore.toggleTheme();
  }
}
