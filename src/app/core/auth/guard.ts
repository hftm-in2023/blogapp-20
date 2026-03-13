import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from './state';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = async (route, state) => {
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

  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });
};

export default authGuard;
