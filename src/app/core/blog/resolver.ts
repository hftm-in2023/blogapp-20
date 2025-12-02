import { ResolveFn } from '@angular/router';
import { BlogBackend, Entries } from './blog-backend';
import { inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';

export const entriesResolver: ResolveFn<Entries> = async () => {
  const blogBackendService = inject(BlogBackend);
  return await lastValueFrom(blogBackendService.getBlogPosts());
};

export default entriesResolver;
