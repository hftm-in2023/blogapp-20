import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { z } from 'zod';
import { environment } from '../../../environments/environment';

const BlogSchema = z.object({
  id: z.number(),
  title: z.string(),
  contentPreview: z.string(),
  author: z.string(),
  likes: z.number(),
  comments: z.number(),
  likedByMe: z.boolean(),
  createdByMe: z.boolean(),
  headerImageUrl: z.string().optional(),
  createdAt: z.string(),
});

const BlogArraySchema = z.array(BlogSchema);

const EntriesSchema = z.object({
  data: BlogArraySchema,
  pageIndex: z.number(),
  pageSize: z.number(),
  totalCount: z.number(),
  maxPageSize: z.number(),
});

export type Blog = z.infer<typeof BlogSchema>;

export type Entries = z.infer<typeof EntriesSchema>;

@Injectable({
  providedIn: 'root',
})
export class BlogBackend {
  readonly #http = inject(HttpClient);

  async fetchEntries(searchstring?: string): Promise<Entries> {
    const params: Record<string, string> = {};
    if (searchstring) params['searchstring'] = searchstring;
    const data = await lastValueFrom(
      this.#http.get(`${environment.bffUrl}/entries`, { params }),
    );
    return EntriesSchema.parse(data);
  }

  likeEntry(id: number, likedByMe: boolean): Promise<void> {
    return lastValueFrom(
      this.#http.put<void>(`${environment.bffUrl}/entries/${id}/like`, {
        likedByMe,
      }),
    );
  }
}
