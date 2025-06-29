import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { NgStyle } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

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
  imports: [MatCardModule, RouterLink, MatButtonModule, MatIconModule, NgStyle],
})
export class BlogCard {
  model = input.required<Blog>();
  index = input.required<number>();
  routeCommands = input.required<[string, number]>();

  likeBlog = output<{
    id: number;
    likedByMe: boolean;
  }>();
}
