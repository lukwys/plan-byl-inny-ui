import { STRAPI_URL } from "@/config/strapi";
import { requestData } from "@/lib/http/requestData";
import { PublicCommentModel } from "@/types/comments";

export const strapiService = {
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
