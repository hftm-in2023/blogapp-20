import { loggingInterceptor } from './logging';
import { correlationInterceptor } from './correlation';
import { withInterceptors } from '@angular/common/http';

export const withCoreInterceptors = () =>
  withInterceptors([correlationInterceptor, loggingInterceptor]);
