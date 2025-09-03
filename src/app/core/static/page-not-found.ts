import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'PageNotFound',
  template: `<h1>Diese Seite konnte leider nicht gefunden werden.</h1>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageNotFound {}
