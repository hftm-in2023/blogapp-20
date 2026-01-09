import { Routes } from '@angular/router';
import { ERROR_ROUTES } from './core/error';
import { STATIC_ROUTES } from './core/static';

import authGuard from './core/auth/guard';

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
    loadChildren: () => import('./feature/blog-overview/blog-overview-route'),
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
