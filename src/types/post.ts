import { CategoryModel } from "./category";
import { ContentBlock } from "./content-block";
import { StrapiImage } from "./strapi";

export type PostModel = {
  documentId: string;
  title: string;
  cover_image: StrapiImage;
  content_blocks: ContentBlock[];
  category?: CategoryModel;
  date: string;
  preview: string;
  slug: string;
};

export type Params = { slug: string };

// export type PostModel = {
//   documentId: string;
//   date: string;
//   title: string;
//   content: string;
//   createdAt: string;
//   updatedAt: string;
//   publishedAt: string;
//   cover_image: StrapiImage;
//   preview: string;
//   slug: string;
//   category?: CategoryModel;
};
