import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { Breakpoints } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavContent, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { MatProgressBar } from '@angular/material/progress-bar';
import { RouterStore } from '../../state';
import { ThemeStore } from '../../theme';
import { FooterComponent } from '../footer/footer';
import { NavigationEnd } from '@angular/router';
import {
  breakpointSignal,
  debouncedEffect,
  onNavigation,
  queryParamSignal,
} from '../../utils';

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
  readonly #translate = inject(TranslateService);
  readonly #themeStore = inject(ThemeStore);
  readonly #router = inject(Router);
  protected readonly isLoading = inject(RouterStore).isLoading;
  protected readonly isDarkMode = this.#themeStore.isDarkMode;
  protected readonly currentLang = signal(
    this.#translate.getCurrentLang() || 'en',
  );
  private readonly sidenavContent = viewChild(MatSidenavContent);

  readonly #searchText = signal('');
  protected readonly searchText = this.#searchText.asReadonly();
  readonly #routerSearch = queryParamSignal('search', '');

  protected readonly activeTab = queryParamSignal('tab', 'home');

  constructor() {
    onNavigation(NavigationEnd, () => {
      this.sidenavContent()?.getElementRef().nativeElement.scrollTo({ top: 0 });
    });

    effect(() => {
      const search = this.#routerSearch();
      untracked(() => this.#searchText.set(search));
    });

    debouncedEffect(
      this.#searchText,
      (value) => {
        this.#navigateOverview(this.activeTab(), value);
      },
      500,
    );
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

  isHandset = breakpointSignal(Breakpoints.Handset);

  changeLanguage(language: string) {
    this.#translate.use(language);
    this.currentLang.set(language);
  }

  toggleTheme() {
    this.#themeStore.toggleTheme();
  }

  protected onSearchInput(value: string): void {
    this.#searchText.set(value);
  }

  protected onDrawerSearch(value: string): void {
    this.#navigateOverview(this.activeTab(), value);
  }

  #navigateOverview(tab: string | undefined, search: string): void {
    const queryParams: Record<string, string | null> = {};
    queryParams['tab'] = tab === 'home' || !tab ? null : tab;
    queryParams['search'] = search || null;
    this.#router.navigate(['/overview'], {
      queryParams,
      queryParamsHandling: 'merge',
    });
  }
}
