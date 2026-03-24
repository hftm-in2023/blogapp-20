import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  LOCALE_ID,
  signal,
  untracked,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthStore } from '../../core/auth';
import { BlogDetail, BlogDetailBackend, Comment } from './blog-detail-backend';

@Component({
  selector: 'app-blog-detail-page',
  imports: [TranslatePipe, RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './blog-detail-page.html',
  styleUrl: './blog-detail-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BlogDetailPage {
  readonly #locale = inject(LOCALE_ID);
  readonly #backend = inject(BlogDetailBackend);
  readonly #authStore = inject(AuthStore);

  readonly model = input.required<BlogDetail>();

  protected readonly isAuthenticated = this.#authStore.isAuthenticated;

  protected readonly comments = signal<Comment[]>([]);
  protected readonly commentText = signal('');
  protected readonly submitting = signal(false);

  protected readonly commentCount = computed(() => this.comments().length);

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

  constructor() {
    effect(() => {
      const comments = this.model().comments;
      untracked(() => this.comments.set(comments));
    });
  }

  protected commentInitials(comment: Comment): string {
    const parts = comment.author.split(' ');
    return parts.map((p) => p[0]?.toUpperCase() ?? '').join('');
  }

  protected formatCommentDate(createdAt: string): string {
    const date = new Date(createdAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60_000);
    const diffHours = Math.floor(diffMs / 3_600_000);
    const diffDays = Math.floor(diffMs / 86_400_000);

    if (diffMinutes < 1) return 'just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 30) return `${diffDays}d ago`;

    return new Intl.DateTimeFormat(this.#locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  }

  protected async onSubmit(): Promise<void> {
    const content = this.commentText().trim();
    if (!content) return;

    const user = this.#authStore.userData();
    const optimisticComment: Comment = {
      id: Date.now(),
      author: user?.name ?? 'You',
      content,
      createdAt: new Date().toISOString(),
    };

    const previousComments = this.comments();
    this.comments.set([optimisticComment, ...previousComments]);
    this.commentText.set('');
    this.submitting.set(true);

    try {
      await this.#backend.addComment(this.model().id, content);
    } catch {
      this.comments.set(previousComments);
      this.commentText.set(content);
    } finally {
      this.submitting.set(false);
    }
  }
}
