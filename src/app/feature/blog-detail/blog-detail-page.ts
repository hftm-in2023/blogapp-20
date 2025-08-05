import { Component, input } from '@angular/core';

@Component({
  selector: 'BlogDetailPage',
  imports: [],
  templateUrl: './blog-detail-page.html',
  styleUrl: './blog-detail-page.scss',
})
export default class BlogDetailPage {
  protected readonly id = input.required<number>();
}
