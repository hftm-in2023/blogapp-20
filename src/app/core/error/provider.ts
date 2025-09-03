import { ErrorHandler } from '@angular/core';
import { GlobalErrorHandler } from './global-error-handler';

export const provideGlobalErrorHandler = () => ({
  provide: ErrorHandler,
  useClass: GlobalErrorHandler,
});
