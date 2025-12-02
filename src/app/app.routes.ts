import { Routes } from '@angular/router';
import { ERROR_ROUTES } from './core/error';
import { STATIC_ROUTES } from './core/static';

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
    resolve: { model: () => import('./core/blog/resolver') },
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'detail/:id',
    loadComponent: () => import('./feature/blog-detail/blog-detail-page'),
  },
  {
    path: 'add-blog',
    loadComponent: () => import('./feature/add-blog/add-blog-page'),
    canActivate: [() => import('./core/auth/guard')],
  },
  ...ERROR_ROUTES,
  ...STATIC_ROUTES,
];
