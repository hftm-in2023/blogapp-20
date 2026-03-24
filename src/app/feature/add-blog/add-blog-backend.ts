import { inject, Injectable } from '@angular/core';
import z from 'zod';
import { environment } from '../../../environments/environment';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

const CreatedBlogSchema = z.object({
  title: z.string(),
  content: z.string(),
  headerImageUrl: z.string().optional(),
});

export type CreatedBlog = z.infer<typeof CreatedBlogSchema>;

@Injectable({
  providedIn: 'root',
})
export class AddBlogBackend {
  readonly #httpClient = inject(HttpClient);

  addBlog(blog: CreatedBlog) {
    CreatedBlogSchema.parse(blog);
    return lastValueFrom(
      this.#httpClient.post(`${environment.bffUrl}/entries`, blog),
    );
  }
}
