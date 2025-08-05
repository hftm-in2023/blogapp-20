import { inject } from '@angular/core';
import { ResolveFn, Routes } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { BlogBackendService, Entries } from './core/services/backend-service';
import { PageNotFound } from './core/static/page-not-found';

export const entriesResolver: ResolveFn<Entries> = async () => {
  const blogBackendService = inject(BlogBackendService);
  return await lastValueFrom(blogBackendService.getBlogPosts());
};

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full',
  },
  {
    path: 'demo',
    loadComponent: () => import('./feature/demo/demo').then((c) => c.Demo),
  },
  {
    path: 'overview',
    loadComponent: () =>
      import('./feature/blog-overview-page/blog-overview-page').then(
        (c) => c.BlogOverviewPage,
      ),
    resolve: { model: entriesResolver },
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'detail/:id',
    loadComponent: () =>
      import('./feature/blog-detail-page/blog-detail-page').then(
        (c) => c.BlogDetailPage,
      ),
  },
  {
    path: 'error',
    component: Error,
  },
  { path: '**', component: PageNotFound },
];
