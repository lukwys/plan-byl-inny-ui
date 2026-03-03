import { STRAPI_URL } from "@/config/strapi";
import { requestData } from "@/lib/http/requestData";
import { AboutMeModel } from "@/types/about-me";
import { CategoryModel } from "@/types/category";
import { PublicCommentModel } from "@/types/comments";
import { HomePageModel } from "@/types/home";
import { PostModel, PostPageModel } from "@/types/post";
import { SocialLinkModel } from "@/types/social-link";
import qs from "qs";

export const strapiService = {
  async getHomepage(): Promise<HomePageModel> {
    return requestData<HomePageModel>(
      `${STRAPI_URL}/api/homepage?populate=baner`,
      { revalidate: 3600 },
    );
  },
  async getPosts(categorySlug?: string): Promise<PostModel[]> {
    const query = qs.stringify(
      {
        sort: ["date:asc"],
        populate: ["cover_image", "category"],
        filters: categorySlug
          ? { category: { slug: { $eq: categorySlug } } }
          : {},
      },
      { encodeValuesOnly: true },
    );

    return requestData<PostModel[]>(`${STRAPI_URL}/api/posts?${query}`, {
      revalidate: 60,
    });
  },
  async getCategories(): Promise<CategoryModel[]> {
    const query = qs.stringify(
      {
        sort: ["name:asc"],
        pagination: {
          pageSize: 100,
        },
        filters: {
          posts: {
            id: { $notNull: true },
          },
        },
        fields: ["documentId", "name", "slug"],
        populate: {
          image: {
            fields: ["url", "alternativeText"],
          },
        },
      },
      { encodeValuesOnly: true },
    );

    return requestData<CategoryModel[]>(
      `${STRAPI_URL}/api/categories?${query}`,
    );
  },
  async getPostBySlug(slug: string): Promise<PostPageModel | null> {
    const query = qs.stringify(
      {
        filters: {
          slug: { $eq: slug },
        },
        populate: {
          cover_image: true,
          content_blocks: {
            on: {
              "content.gallery": {
                populate: { image_gallery: true },
              },
              "content.paragraph-md": true,
            },
          },
        },
      },
      { encodeValuesOnly: true },
    );

    const posts = await requestData<PostPageModel[]>(
      `${STRAPI_URL}/api/posts?${query}`,
      { revalidate: 3600 },
    );

    return posts[0] ?? null;
  },
  async getSocialLinks(): Promise<SocialLinkModel[]> {
    return requestData<SocialLinkModel[]>(
      `${STRAPI_URL}/api/links?populate=icon`,
      { revalidate: 86400 },
    );
  },
  async getPublishedComments(
    postDocumentId: string,
  ): Promise<PublicCommentModel[]> {
    const query = qs.stringify(
      {
        filters: {
          post: {
            documentId: { $eq: postDocumentId },
          },
          commentStatus: { $eq: "published" },
        },
        sort: ["createdAt:desc"],
        pagination: {
          pageSize: 100,
        },
      },
      { encodeValuesOnly: true },
    );

    return requestData<PublicCommentModel[]>(
      `${STRAPI_URL}/api/comments?${query}`,
      { revalidate: 300 },
    );
  },
  async getAboutMe(): Promise<AboutMeModel> {
    const query = qs.stringify(
      {
        populate: {
          avatar: {
            fields: ["url", "alternativeText"],
          },
          header_image: {
            fields: ["url", "alternativeText"],
          },
        },
        fields: ["title", "bio"],
      },
      { encodeValuesOnly: true },
    );

    return requestData<AboutMeModel>(`${STRAPI_URL}/api/about-me?${query}`, {
      revalidate: 86400,
    });
  },
};
