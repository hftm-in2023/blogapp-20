import { Routes } from '@angular/router';

const BLOG_BACKEND_ROUTE: Routes = [
  {
    path: '',
    loadComponent: () => import('./blog-overview-page'),
  },
];

export default BLOG_BACKEND_ROUTE;
