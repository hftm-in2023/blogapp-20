import { ErrorHandler, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: Error): void {
    const message = error.message ? error.message : error.toString();
    this.postCustomData(error, message);
    if (environment.production) {
      window.location.href = '/error';
    } else {
      console.log('ERROR ->', error);
    }
  }

  async postCustomData(error: Error, message: string) {
    try {
      await fetch(`${environment.serviceUrl}/api/report-error/client-fatal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'client-message': message || '',
          'client-error': error.stack || '',
        }),
      });
    } catch (fetchError) {
      console.error('Failed to report error:', fetchError);
    }
  }
}
