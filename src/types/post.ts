import { StrapiImage } from './strapi';

export type Post = {
  id: number
  documentId: string
  date: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  cover_image: StrapiImage
  preview: string
  slug: string
}
