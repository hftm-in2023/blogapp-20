import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ResolveFn, Routes } from '@angular/router';
import { filter, first } from 'rxjs';
import { Entries, BlogBackend } from './blog-backend';

const entriesResolver: ResolveFn<Entries> = () => {
  const blogBackend = inject(BlogBackend);
  return toObservable(blogBackend.entries.value).pipe(
    filter((value): value is Entries => value !== undefined),
    first(),
  );
};

const BLOG_BACKEND_ROUTE: Routes = [
  {
    path: '',
    resolve: { model: entriesResolver },
    loadComponent: () => import('./blog-overview-page'),
  },
];

export default BLOG_BACKEND_ROUTE;
