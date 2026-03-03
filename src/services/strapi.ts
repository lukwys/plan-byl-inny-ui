import { STRAPI_URL } from "@/config/strapi";
import { requestData } from "@/lib/http/requestData";
import { AboutMeModel } from "@/types/about-me";
import { CategoryModel } from "@/types/category";
import { PublicCommentModel } from "@/types/comments";
import { HomePageModel } from "@/types/home";
import { PostModel } from "@/types/post";
import { SocialLinkModel } from "@/types/social-link";

export const strapiService = {
  async getHomepage(): Promise<HomePageModel> {
    return requestData<HomePageModel>(
      `${STRAPI_URL}/api/homepage?populate=baner`,
      {
        next: { revalidate: 3600 },
      },
    );
  },
  async getPosts(categorySlug?: string): Promise<PostModel[]> {
    const qs = new URLSearchParams();

    qs.set("sort[0]", "date:asc");
    qs.set("populate[0]", "cover_image");
    qs.set("populate[1]", "category");

    if (categorySlug) {
      qs.set("filters[category][slug][$eq]", categorySlug);
    }

    return requestData<PostModel[]>(
      `${STRAPI_URL}/api/posts?${qs.toString()}`,
      undefined,
      { revalidate: 60 },
    );
  },
  async getCategories(): Promise<CategoryModel[]> {
    const qs = new URLSearchParams();

    qs.set("sort", "name:asc");
    qs.set("pagination[pageSize]", "100");
    qs.set("filters[posts][id][$notNull]", "true");
    qs.set("fields[0]", "documentId");
    qs.set("fields[1]", "name");
    qs.set("fields[2]", "slug");

    qs.set("populate[image][fields][0]", "url");
    qs.set("populate[image][fields][1]", "alternativeText");

    return requestData<CategoryModel[]>(
      `${STRAPI_URL}/api/categories?${qs.toString()}`,
    );
  },
  async getSocialLinks(): Promise<SocialLinkModel[]> {
    return requestData<SocialLinkModel[]>(
      `${STRAPI_URL}/api/links?populate=icon`,
      {
        next: {
          revalidate: 86400,
        },
      },
    );
  },
  async getPublishedComments(
    postDocumentId: string,
  ): Promise<PublicCommentModel[]> {
    const qs = new URLSearchParams({
      "filters[post][documentId][$eq]": postDocumentId,
      "filters[commentStatus][$eq]": "published",
      sort: "createdAt:desc",
      "pagination[pageSize]": "100",
    });

    return requestData<PublicCommentModel[]>(
      `${STRAPI_URL}/api/comments?${qs.toString()}`,
      {
        next: { revalidate: 300 },
      },
    );
  },
  async getAboutMe() {
    return requestData<AboutMeModel>(`${STRAPI_URL}/api/about-me?populate=*`, {
      next: { revalidate: 86400 },
    });
  },
};
