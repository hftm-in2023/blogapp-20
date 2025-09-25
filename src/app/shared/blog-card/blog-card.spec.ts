import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Blog, BlogCard } from './blog-card';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router, provideRouter } from '@angular/router';
import { CommonModule } from '@angular/common';

describe('BlogCard', () => {
  let component: BlogCard;
  let fixture: ComponentFixture<BlogCard>;
  let routerMock: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
      imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        BlogCard,
      ],
    });
    fixture = TestBed.createComponent(BlogCard);
    component = fixture.componentInstance;
    routerMock = TestBed.inject(Router);
    routerMock.initialNavigation();

    fixture.componentRef.setInput('routeCommands', ['/path', 1]);
  });

  it('should create', () => {
    // arrange
    fixture.componentRef.setInput('model', {
      id: 1,
      author: 'a author',
      likedByMe: false,
      title: 'A title',
    } as Blog);

    // act
    fixture.detectChanges();

    // assert
    expect(component).toBeTruthy();
  });
});
