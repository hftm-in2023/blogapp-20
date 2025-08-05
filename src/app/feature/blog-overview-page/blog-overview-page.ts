import { Component, model } from '@angular/core';
import { BlogCard } from '../../shared/blog-card/blog-card';

type Model = {
  data: {
    id: number;
    title: string;
    contentPreview: string;
    author: string;
    likes: number;
    comments: number;
    likedByMe: boolean;
    createdByMe: boolean;
    headerImageUrl?: string | undefined;
  }[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  maxPageSize: number;
};

@Component({
  selector: 'app-blog-overview-page',
  imports: [BlogCard],
  templateUrl: './blog-overview-page.html',
  styleUrl: './blog-overview-page.scss',
})
export class BlogOverviewPage {
  model = model.required<Model>({});

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  likeBlog($event: { id: number; likedByMe: boolean }) {
    throw new Error('Method not implemented.');
  }
}
