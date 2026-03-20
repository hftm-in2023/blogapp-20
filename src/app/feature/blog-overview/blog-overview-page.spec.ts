import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import BlogOverviewPage from './blog-overview-page';
import { Blog, BlogCard } from '../../shared/blog-card/blog-card';
import { MockProvider } from '../../core/mock-provider';
import { By } from '@angular/platform-browser';
import { BlogBackend } from './blog-backend';
import { TranslateModule } from '@ngx-translate/core';

describe('BlogOverviewPage', () => {
  let component: BlogOverviewPage;
  let fixture: ComponentFixture<BlogOverviewPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ from: 1 }),
          },
        },
        MockProvider(BlogBackend),
      ],
      imports: [BlogOverviewPage, TranslateModule.forRoot()],
    })
      .overrideComponent(BlogCard, {
        set: { template: '<div>Mocked Component</div>' },
      })
      .compileComponents();

    fixture = TestBed.createComponent(BlogOverviewPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should invoke the likeBlog function when the likeBlog event handler is triggered', () => {
    // arrange
    fixture.componentRef.setInput('model', {
      data: [{ id: 1 }, { id: 2 }] as Blog[],
      pageIndex: 0,
      pageSize: 2,
      totalCount: 2,
      maxPageSize: 5,
    });
    fixture.detectChanges();
    const likeBlogSpy = vi
      .spyOn(component, 'likeBlog')
      .mockImplementation(() => undefined);
    const blogOverviewComponent = fixture.debugElement.query(
      By.css('[data-testid="blog-card"]'),
    );
    // act
    blogOverviewComponent.triggerEventHandler('likeBlog', {
      id: 1,
      likedByMe: true,
    });
    // assert
    expect(likeBlogSpy).toHaveBeenCalledWith({ id: 1, likedByMe: true });
  });
  it('should render a BlogOverviewCardComponent for each blog', () => {
    // arrange
    fixture.componentRef.setInput('model', {
      data: [{ id: 1 }, { id: 2 }] as Blog[],
      pageIndex: 0,
      pageSize: 2,
      totalCount: 2,
      maxPageSize: 5,
    });
    fixture.detectChanges();
    // arrange -- act
    const blogOverviewComponents = fixture.debugElement.queryAll(
      By.css('[data-testid="blog-card"]'),
    );
    // assert
    expect(blogOverviewComponents.length).toBe(2);
  });
});
