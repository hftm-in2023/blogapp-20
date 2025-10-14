import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Blog, BlogCard } from './blog-card';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router, UrlTree, provideRouter } from '@angular/router';
import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';

describe('BlogCard', () => {
  let component: BlogCard;
  let fixture: ComponentFixture<BlogCard>;
  let routerMock: Router;
  let navigateSpy: jasmine.Spy;

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

  it('should display the title', () => {
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
    const node: HTMLElement = fixture.debugElement.nativeElement.querySelector(
      '[data-testid="title"]',
    );
    expect(node.innerText).toBe('A title');
  });
  it('should show the like button in black when likedByMe is false', () => {
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
    const matIcon = fixture.debugElement.query(
      By.css('[data-testid="like-button-icon"]'),
    );
    expect(matIcon.styles['color']).toBe('black');
  });
  it('should show the like button in red when likedByMe is true', () => {
    // arrange
    fixture.componentRef.setInput('model', {
      id: 1,
      author: 'a author',
      likedByMe: true,
      title: 'A title',
    } as Blog);
    // act
    fixture.detectChanges();
    // assert
    const matIcon = fixture.debugElement.query(
      By.css('[data-testid="like-button-icon"]'),
    );
    expect(matIcon.styles['color']).toBe('red');
  });
  it('should navigate to a certain blog when the image or header is clicked', () => {
    // arrange
    fixture.componentRef.setInput('model', {
      id: 1,
      author: 'a author',
      likedByMe: false,
      title: 'A title',
    } as Blog);
    fixture.detectChanges();
    navigateSpy = spyOn(routerMock, 'navigateByUrl').and.returnValue(
      Promise.resolve(true),
    );
    // act
    const debugEl: HTMLElement = fixture.debugElement.query(
      By.css('[data-testid="title"]'),
    ).nativeElement;
    debugEl.click();
    // assert

    const urlTree: UrlTree = routerMock.createUrlTree(['/path', 1]);
    expect(navigateSpy).toHaveBeenCalledWith(urlTree, jasmine.any(Object));
  });
});
