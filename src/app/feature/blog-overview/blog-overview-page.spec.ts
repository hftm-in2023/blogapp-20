import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockComponent, MockProvider, ngMocks } from 'ng-mocks';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import BlogOverviewPage from './blog-overview-page';
import { BlogBackend } from '../../core/blog/blog-backend';
import { Blog, BlogCard } from '../../shared/blog-card/blog-card';

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
    const likeBlogSpy = spyOn(component, 'likeBlog');
    const blogOverviewComponent = ngMocks.find('BlogCard');
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
    const blogOverviewComponents = ngMocks.findAll('BlogCard');
    // assert
    expect(blogOverviewComponents.length).toBe(2);
  });
});
