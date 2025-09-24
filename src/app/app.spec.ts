import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { MockProvider } from 'ng-mocks';
import { AuthStore } from './core/auth';
import { provideRouter } from '@angular/router';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([]), MockProvider(AuthStore)],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
