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
  protected readonly model = input.required<Blog>();
  protected readonly index = input.required<number>();
  protected readonly routeCommands = input.required<[string, number]>();

  likeBlog = output<{
    id: number;
    likedByMe: boolean;
  }>();
}
