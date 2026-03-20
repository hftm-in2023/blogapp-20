import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  template: `<h1>Diese Seite konnte leider nicht gefunden werden.</h1>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PageNotFound {}
