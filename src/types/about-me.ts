import { ContentBlock } from "./content-block";
import { StrapiImage } from "./strapi";

export type AboutMeModel = {
  header_image: StrapiImage;
  title: string;
  bio: string;
  avatar: StrapiImage;
  content_blocks: ContentBlock[];
};
