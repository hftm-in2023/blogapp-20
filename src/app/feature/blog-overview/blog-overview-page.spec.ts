import { ComponentFixture, TestBed } from '@angular/core/testing';

import BlogOverviewPage from './blog-overview-page';

describe('BlogOverviewPage', () => {
  let component: BlogOverviewPage;
  let fixture: ComponentFixture<BlogOverviewPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogOverviewPage],
    }).compileComponents();

    fixture = TestBed.createComponent(BlogOverviewPage);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('model', {});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
