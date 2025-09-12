import { inject, Injectable } from '@angular/core';
import z from 'zod';
import { environment } from '../../../environments/environment.development';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

const CreatedBlogSchema = z.object({
  title: z.string(),
  content: z.string(),
});

export type CreatedBlog = z.infer<typeof CreatedBlogSchema>;

@Injectable({
  providedIn: 'root',
})
export class AddBlogService {
  httpClient = inject(HttpClient);

  addBlog(blog: CreatedBlog) {
    CreatedBlogSchema.parse(blog);
    return lastValueFrom(
      this.httpClient.post(`${environment.serviceUrl}/entries`, blog),
    );
  }
}
