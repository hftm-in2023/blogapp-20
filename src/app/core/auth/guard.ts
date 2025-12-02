import { CanActivateFn } from '@angular/router';
import { AuthStore } from './state';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = async () => {
  const authStore = inject(AuthStore);
  const roles = await authStore.roles();
  console.log('User Roles from Auth Guard', roles);
  return authStore.isAuthenticated() && roles?.includes('user')
    ? true
    : (authStore.login(), false);
};

export default authGuard;
