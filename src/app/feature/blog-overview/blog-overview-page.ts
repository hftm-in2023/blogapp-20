import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BlogCard } from '../../shared/blog-card/blog-card';
import { BlogBackend } from './blog-backend';

@Component({
  selector: 'app-blog-overview-page',
  imports: [BlogCard],
  templateUrl: './blog-overview-page.html',
  styleUrl: './blog-overview-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BlogOverviewPage {
  readonly #backend = inject(BlogBackend);
  protected readonly entries = this.#backend.entries;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  likeBlog($event: { id: number; likedByMe: boolean }) {
    throw new Error('Method not implemented.');
  }
}
