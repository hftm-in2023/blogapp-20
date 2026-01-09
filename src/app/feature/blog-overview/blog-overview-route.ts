import { inject } from '@angular/core';
import { ResolveFn, Routes } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { Entries, BlogBackend } from './blog-backend';

const entriesResolver: ResolveFn<Entries> = async () => {
  const blogBackendService = inject(BlogBackend);
  return await lastValueFrom(blogBackendService.getBlogPosts());
};

const BLOG_BACKEND_ROUTE: Routes = [
  {
    path: '',
    resolve: { model: entriesResolver },
    loadComponent: () => import('./blog-overview-page'),
  },
];

export default BLOG_BACKEND_ROUTE;
