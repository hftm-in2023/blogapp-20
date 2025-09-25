import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockComponent, MockProvider } from 'ng-mocks';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import BlogOverviewPage from './blog-overview-page';
import { BlogBackend } from '../../core/blog/blog-backend';
import { BlogCard } from '../../shared/blog-card/blog-card';

describe('BlogOverviewPage', () => {
  let component: BlogOverviewPage;
  let fixture: ComponentFixture<BlogOverviewPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ from: 1 }),
          },
        },
        MockProvider(BlogBackend),
      ],
      imports: [BlogOverviewPage, MockComponent(BlogCard)],
    });
    fixture = TestBed.createComponent(BlogOverviewPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
