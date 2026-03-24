import { inject } from '@angular/core';
import { ResolveFn, Routes } from '@angular/router';
import { Entries, BlogBackend } from './blog-backend';

const entriesResolver: ResolveFn<Entries> = (route) => {
  const blogBackend = inject(BlogBackend);
  const tab = route.queryParamMap.get('tab');
  const search =
    tab === 'liked'
      ? undefined
      : (route.queryParamMap.get('search') ?? undefined);
  return blogBackend.fetchEntries(search);
};

const BLOG_BACKEND_ROUTE: Routes = [
  {
    path: '',
    resolve: { model: entriesResolver },
    loadComponent: () => import('./blog-overview-page'),
    runGuardsAndResolvers: 'always',
  },
];

export default BLOG_BACKEND_ROUTE;
