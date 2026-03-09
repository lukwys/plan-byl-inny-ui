import { StrapiImage } from "./strapi";

export type AboutMeModel = {
  header_image: StrapiImage;
  title: string;
  bio: string;
  bio_short: string;
  avatar: StrapiImage;
};
