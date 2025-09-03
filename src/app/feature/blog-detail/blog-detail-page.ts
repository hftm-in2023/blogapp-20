import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'BlogDetailPage',
  imports: [],
  templateUrl: './blog-detail-page.html',
  styleUrl: './blog-detail-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BlogDetailPage {
  protected readonly id = input.required<number>();
}
