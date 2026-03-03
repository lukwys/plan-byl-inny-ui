import { STRAPI_URL } from "@/config/strapi";
import { requestData } from "@/lib/http/requestData";
import { PublicCommentModel } from "@/types/comments";
import { HomePageModel } from "@/types/home";
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
};
