import { StrapiImage } from "./strapi";

export type HomePageModel = {
  baner: StrapiImage;
  tagline?: string | null;
};
