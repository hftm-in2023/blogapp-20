import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

export type Blog = {
  author: string;
  comments: number;
  contentPreview: string;
  createdByMe: boolean;
  id: number;
  likedByMe: boolean;
  likes: number;
  title: string;
};

@Component({
  selector: 'BlogCard',
  templateUrl: './blog-card.html',
  styleUrls: ['./blog-card.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MatIconModule],
})
export class BlogCard {
  readonly model = input.required<Blog>();
  readonly routeCommands = input.required<[string, number]>();

  likeBlog = output<{
    id: number;
    likedByMe: boolean;
  }>();
}
