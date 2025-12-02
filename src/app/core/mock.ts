import {
  Component,
  ɵgetComponentDef as getComponentDef,
  EventEmitter,
  signal,
  Type,
  Provider,
} from '@angular/core';
/// <reference types="jasmine" />

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const jasmine: any;

/**
 * Automatically creates a mock based on the component's Angular metadata.
 * Supports:
 *  - Signal inputs (input())
 *  - Classic @Input()
 *  - Classic @Output()
 *  - Signal outputs (output())
 */
export function MockComponent<T>(original: Type<T>): Type<unknown> {
  const def = getComponentDef(original);

  if (!def) throw new Error('No Angular component definition found.');

  const selector = (
    typeof def.selectors?.[0]?.[0] === 'string'
      ? def.selectors[0][0]
      : 'mock-component'
  ) as string;

  const inputNames = Object.keys(def.inputs ?? {});
  const outputNames = Object.keys(def.outputs ?? {});

  @Component({
    selector,
    standalone: true,
    template: `<ng-content></ng-content>`,
  })
  class MockComponent {
    [key: string]: unknown;

    constructor() {
      // Outputs: always create an EventEmitter
      for (const output of outputNames) {
        (this as Record<string, unknown>)[output] = new EventEmitter<unknown>();
      }

      // Inputs: create a signal() input with .set()
      for (const input of inputNames) {
        const s = signal<unknown>(undefined);
        (this as Record<string, unknown>)[input] = Object.assign(s, {
          set: (v: unknown) => s.set(v),
        });
      }
    }
  }

  return MockComponent;
}

/**
 * Automatically creates a mock provider for a given service class or injection token.
 *
 * - All methods become jasmine spies
 * - All properties become writable spy values
 */
export function MockProvider<T>(token: Type<T> | unknown): Provider {
  const mock: Record<string, unknown> = {};

  // If token is a class, inspect its prototype
  const prototype = (typeof token === 'function' ? token.prototype : {}) ?? {};

  // create spy for each method on the prototype
  for (const key of Object.getOwnPropertyNames(prototype)) {
    if (key === 'constructor') continue;

    const descriptor = Object.getOwnPropertyDescriptor(prototype, key);
    if (descriptor && typeof descriptor.value === 'function') {
      // method -> spy function
      mock[key] = jasmine.createSpy(key);
    } else {
      // property -> spy object
      mock[key] = undefined;
    }
  }

  return {
    provide: token,
    useValue: mock,
  };
}
