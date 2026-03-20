import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-blog-detail-page',
  imports: [TranslatePipe],
  templateUrl: './blog-detail-page.html',
  styleUrl: './blog-detail-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BlogDetailPage {
  protected readonly id = input.required<number>();
}
