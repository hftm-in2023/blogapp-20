import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  LOCALE_ID,
  output,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

export type Blog = {
  author: string;
  comments: number;
  contentPreview: string;
  createdAt: string;
  createdByMe: boolean;
  headerImageUrl?: string;
  id: number;
  likedByMe: boolean;
  likes: number;
  title: string;
};

@Component({
  selector: 'app-blog-card',
  templateUrl: './blog-card.html',
  styleUrls: ['./blog-card.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MatIconModule],
})
export class BlogCard {
  readonly #locale = inject(LOCALE_ID);

  readonly model = input.required<Blog>();
  readonly routeCommands = input.required<[string, number]>();

  readonly initials = computed(() => {
    const parts = this.model().author.split(' ');
    return parts.map((p) => p[0]?.toUpperCase() ?? '').join('');
  });

  readonly formattedDate = computed(() => {
    const date = new Date(this.model().createdAt);
    return new Intl.DateTimeFormat(this.#locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  });

  likeBlog = output<{
    id: number;
    likedByMe: boolean;
  }>();
}
