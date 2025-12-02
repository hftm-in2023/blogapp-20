import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { AuthStore } from './core/auth';
import { provideRouter } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MockProvider } from './core/mock';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        MockProvider(AuthStore),
        MockProvider(TranslateService),
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
