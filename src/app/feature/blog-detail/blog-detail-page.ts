import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  LOCALE_ID,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { BlogDetail } from './blog-detail-backend';

@Component({
  selector: 'app-blog-detail-page',
  imports: [TranslatePipe, RouterLink],
  templateUrl: './blog-detail-page.html',
  styleUrl: './blog-detail-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BlogDetailPage {
  readonly #locale = inject(LOCALE_ID);

  readonly model = input.required<BlogDetail>();

  protected readonly initials = computed(() => {
    const parts = this.model().author.split(' ');
    return parts.map((p) => p[0]?.toUpperCase() ?? '').join('');
  });

  protected readonly formattedDate = computed(() => {
    const date = new Date(this.model().createdAt);
    return new Intl.DateTimeFormat(this.#locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  });
}
