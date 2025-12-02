export const STATIC_ROUTES = [
  { path: '**', loadComponent: () => import('./page-not-found') },
];
