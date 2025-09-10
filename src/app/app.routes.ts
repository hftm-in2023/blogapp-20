import { inject } from '@angular/core';
import { CanActivateFn, ResolveFn, Routes } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { BlogBackend, Entries } from './core/blog/blog-backend';
import { ERROR_ROUTES } from './core/error';
import { STATIC_ROUTES } from './core/static';
import { AuthStore } from './core/auth';

const entriesResolver: ResolveFn<Entries> = async () => {
  const blogBackendService = inject(BlogBackend);
  return await lastValueFrom(blogBackendService.getBlogPosts());
};

const authGuard: CanActivateFn = async () => {
  const authStore = inject(AuthStore);
  const roles = await authStore.roles();
  console.log('User Roles from Auth Guard', roles);
  return authStore.isAuthenticated() && roles?.includes('user')
    ? true
    : (authStore.login(), false);
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
  {
    path: 'add-blog',
    loadComponent: () => import('./feature/add-blog/add-blog-page'),
    canActivate: [authGuard],
  },
  ...ERROR_ROUTES,
  ...STATIC_ROUTES,
];
