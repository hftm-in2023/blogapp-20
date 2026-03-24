import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  output,
  signal,
  Signal,
  viewChild,
} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavContent, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { filter, map, shareReplay } from 'rxjs/operators';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MatProgressBar } from '@angular/material/progress-bar';
import { RouterStore } from '../../state';
import { ThemeStore } from '../../theme';
import { FooterComponent } from '../footer/footer';

@Component({
  selector: 'app-sidebar',
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
    MatDivider,
    FooterComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  readonly #breakpointObserver = inject(BreakpointObserver);
  readonly #translate = inject(TranslateService);
  readonly #themeStore = inject(ThemeStore);
  readonly #router = inject(Router);
  readonly #destroyRef = inject(DestroyRef);
  protected readonly isLoading = inject(RouterStore).isLoading;
  protected readonly isDarkMode = this.#themeStore.isDarkMode;
  protected readonly currentLang = signal(
    this.#translate.getCurrentLang() || 'en',
  );
  private readonly sidenavContent = viewChild(MatSidenavContent);

  constructor() {
    this.#router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe(() => {
        this.sidenavContent()
          ?.getElementRef()
          .nativeElement.scrollTo({ top: 0 });
      });
  }

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
    this.currentLang.set(language);
  }

  toggleTheme() {
    this.#themeStore.toggleTheme();
  }
}
