import { STRAPI_URL } from "@/config/strapi";

export const getStrapiImage = (url: string | null) => {
  if (!url) return "";

  if (url.startsWith("http")) {
    return url;
  }

  return `${STRAPI_URL}${url}`;
};
