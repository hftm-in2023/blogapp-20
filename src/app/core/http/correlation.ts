import { HttpInterceptorFn } from '@angular/common/http';

export const correlationInterceptor: HttpInterceptorFn = (req, next) => {
  const clonedRequest = req.clone({
    setHeaders: {
      'x-correlation-id': crypto.randomUUID(),
    },
  });
  return next(clonedRequest);
};
