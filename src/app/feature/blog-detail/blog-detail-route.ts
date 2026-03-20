import { inject } from '@angular/core';
import { ResolveFn, Routes } from '@angular/router';
import { from } from 'rxjs';
import { BlogDetail, BlogDetailBackend } from './blog-detail-backend';

const blogDetailResolver: ResolveFn<BlogDetail> = (route) => {
  const backend = inject(BlogDetailBackend);
  const id = Number(route.params['id']);
  return from(backend.getEntry(id));
};

export default [
  {
    path: '',
    resolve: { model: blogDetailResolver },
    loadComponent: () => import('./blog-detail-page'),
  },
] satisfies Routes;
