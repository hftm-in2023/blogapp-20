import { inject } from '@angular/core';
import { ResolveFn, Routes } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { BlogBackend, Entries } from './core/blog/blog-backend';
import { ERROR_ROUTES } from './core/error';
import { STATIC_ROUTES } from './core/static';

export const entriesResolver: ResolveFn<Entries> = async () => {
  const blogBackendService = inject(BlogBackend);
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
    loadComponent: () => import('./feature/demo/demo'),
  },
  {
    path: 'overview',
    loadComponent: () => import('./feature/blog-overview/blog-overview-page'),
    resolve: { model: entriesResolver },
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'detail/:id',
    loadComponent: () => import('./feature/blog-detail/blog-detail-page'),
  },
  ...ERROR_ROUTES,
  ...STATIC_ROUTES,
];
