import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'Error',
  template: `<h1>Oops! Something went wrong.</h1>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Error {}
