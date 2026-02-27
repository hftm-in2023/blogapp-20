import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'Error',
  template: `<div class="status-page">
    <h1>Error</h1>
    <p>Oops! Something went wrong.</p>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Error {}
