import { CanMatchFn, Router, UrlSegment } from '@angular/router';
import { AuthStore } from './state';
import { inject } from '@angular/core';

export const authGuard: CanMatchFn = async (_route, segments: UrlSegment[]) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  // Wait for session check to complete
  if (authStore.loading()) {
    await new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (!authStore.loading()) {
          clearInterval(interval);
          resolve();
        }
      }, 50);
    });
  }

  const roles = authStore.roles();
  console.log('User Roles from Auth Guard', roles);

  if (authStore.isAuthenticated() && roles?.includes('user')) {
    return true;
  }

  const returnUrl = '/' + segments.map((s) => s.path).join('/');
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl },
  });
};

export default authGuard;
