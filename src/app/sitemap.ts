import { SITE_URL } from "@/config/next";
import { strapiService } from "@/services/strapi";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories] = await Promise.all([
    strapiService.getPosts(),
    strapiService.getCategories(),
  ]);

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/wpis/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${SITE_URL}/kategoria/${category.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [
    {
      url: `${SITE_URL}`,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/o-mnie`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/kontakt`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...categoryEntries,
    ...postEntries,
  ];
}
