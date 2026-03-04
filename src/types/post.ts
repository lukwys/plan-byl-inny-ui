import { CategoryModel } from "./category";
import { StrapiImage } from "./strapi";

type ParagraphBlock = {
  id: number;
  __component: "content.paragraph-md";
  paragraph: string;
};

type GalleryImage = {
  documentId: string;
  url: string;
  alternativeText?: string | null;
  width: number;
  height: number;
  caption?: string;
};

export type GalleryBlock = {
  id: number;
  __component: "content.gallery";
  image_gallery?: GalleryImage[];
};

type ContentBlock = ParagraphBlock | GalleryBlock;

export type PostPageModel = {
  documentId: string;
  title: string;
  cover_image: StrapiImage;
  content_blocks: ContentBlock[];
};

export type Params = { slug: string };

export type PostModel = {
  documentId: string;
  date: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  cover_image: StrapiImage;
  preview: string;
  slug: string;
  category?: CategoryModel;
};
