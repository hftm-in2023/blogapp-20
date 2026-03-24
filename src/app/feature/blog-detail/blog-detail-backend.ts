import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { z } from 'zod';
import { environment } from '../../../environments/environment';

const CommentSchema = z.object({
  id: z.number(),
  author: z.string(),
  content: z.string(),
  createdAt: z.string(),
});

const BlogDetailSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string(),
  author: z.string(),
  likes: z.number(),
  comments: z.array(CommentSchema),
  likedByMe: z.boolean(),
  createdByMe: z.boolean(),
  headerImageUrl: z.string().optional(),
  createdAt: z.string(),
});

export type BlogDetail = z.infer<typeof BlogDetailSchema>;

@Injectable({
  providedIn: 'root',
})
export class BlogDetailBackend {
  readonly #httpClient = inject(HttpClient);

  async getEntry(id: number): Promise<BlogDetail> {
    const data = await lastValueFrom(
      this.#httpClient.get(`${environment.bffUrl}/entries/${id}`),
    );
    return BlogDetailSchema.parse(data);
  }
}
