import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { APP_ROUTES } from './app.routes';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { provideGlobalErrorHandler } from './core/error/provider';
import coreInterceptors from './core/http';
import { authInterceptor, provideAuth } from 'angular-auth-oidc-client';
import { authConfig } from './core/auth/auth.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(APP_ROUTES, withComponentInputBinding()),
    provideHttpClient(
      withFetch(),
      withInterceptors([...coreInterceptors, authInterceptor()]),
    ),
    provideGlobalErrorHandler(),
    provideAuth(authConfig),
  ],
};
