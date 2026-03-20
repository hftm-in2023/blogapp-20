import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { BlogCard } from '../../shared/blog-card/blog-card';
import { BlogBackend } from './blog-backend';

type Model = {
  data: {
    id: number;
    title: string;
    contentPreview: string;
    author: string;
    likes: number;
    comments: number;
    likedByMe: boolean;
    createdByMe: boolean;
    headerImageUrl?: string | undefined;
    createdAt: string;
  }[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  maxPageSize: number;
};

@Component({
  selector: 'app-blog-overview-page',
  imports: [BlogCard, TranslatePipe],
  templateUrl: './blog-overview-page.html',
  styleUrl: './blog-overview-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BlogOverviewPage {
  readonly #blogBackend = inject(BlogBackend);
  protected readonly model = input.required<Model>();
  readonly #overrides = signal<
    Map<number, { likedByMe: boolean; likes: number }>
  >(new Map());

  protected readonly entries = computed(() => {
    const overrides = this.#overrides();
    return this.model().data.map((entry) => {
      const override = overrides.get(entry.id);
      return override ? { ...entry, ...override } : entry;
    });
  });

  async likeBlog($event: { id: number; likedByMe: boolean }) {
    const toggled = !$event.likedByMe;
    const entry = this.model().data.find((e) => e.id === $event.id);
    if (!entry) return;

    const currentLikes = this.#overrides().get(entry.id)?.likes ?? entry.likes;
    const delta = toggled ? 1 : -1;

    this.#overrides.update((map) => {
      const next = new Map(map);
      next.set($event.id, { likedByMe: toggled, likes: currentLikes + delta });
      return next;
    });

    try {
      await this.#blogBackend.likeEntry($event.id, toggled);
    } catch {
      this.#overrides.update((map) => {
        const next = new Map(map);
        next.delete($event.id);
        return next;
      });
    }
  }
}
