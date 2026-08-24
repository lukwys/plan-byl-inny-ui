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
  newsletter_sent_at?: string | null;
};

export type Params = { slug: string };
