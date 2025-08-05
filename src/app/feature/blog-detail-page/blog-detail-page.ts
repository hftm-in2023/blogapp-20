import { Component, input } from '@angular/core';

@Component({
  selector: 'BlogDetailPage',
  imports: [],
  templateUrl: './blog-detail-page.html',
  styleUrl: './blog-detail-page.scss',
})
export class BlogDetailPage {
  id = input.required<number>();
}
