import {
  ApplicationConfig,
  ErrorHandler,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { APP_ROUTES } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { GlobalErrorHandler } from './core/error/global-error-handler';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(APP_ROUTES, withComponentInputBinding()),
    provideHttpClient(withFetch()),
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler,
    },
  ],
};
