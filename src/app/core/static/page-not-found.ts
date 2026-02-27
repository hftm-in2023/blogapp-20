import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'PageNotFound',
  template: `<div class="status-page">
    <h1>404</h1>
    <p>Diese Seite konnte leider nicht gefunden werden.</p>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PageNotFound {}
