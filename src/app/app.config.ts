import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { APP_ROUTES } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideGlobalErrorHandler } from './core/error/provider';
import { withCoreInterceptors } from './core/http/provider';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(APP_ROUTES, withComponentInputBinding()),
    provideHttpClient(withFetch(), withCoreInterceptors()),
    provideGlobalErrorHandler(),
  ],
};
