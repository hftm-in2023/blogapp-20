import { httpResource } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
  readonly entries = httpResource<Entries>(
    () => `${environment.serviceUrl}/entries`,
    {
      parse: (data) => EntriesSchema.parse(data),
    },
  );
}
