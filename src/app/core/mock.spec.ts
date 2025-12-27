import { Type, Provider } from '@angular/core';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const jasmine: any;

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
