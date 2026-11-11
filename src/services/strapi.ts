import { draftMode } from "next/headers";
import { STRAPI_URL, STRAPI_API_TOKEN } from "@/config/strapi";
import { requestData, requestJson } from "@/lib/http/requestData";
import { getPageRange, getTotalPages } from "@/lib/posts/pagination";
import { AboutMeModel } from "@/types/about-me";
import { CategoryModel } from "@/types/category";
import { PublicCommentModel } from "@/types/comments";
import { HomePageModel } from "@/types/home";
import { PostModel } from "@/types/post";
import { SocialLinkModel } from "@/types/social-link";
import qs from "qs";

export const strapiService = {
  async getHomepage(): Promise<HomePageModel> {
    return requestData<HomePageModel>(
      `${STRAPI_URL}/api/homepage?populate=baner`,
      { revalidate: 3600, tags: ["homepage"] },
    );
  },
  async getPosts(categorySlug?: string): Promise<PostModel[]> {
    const posts: PostModel[] = [];
    let page = 1;
    let pageCount = 1;

    // Strapi caps a single response (25 by default, 100 max), so fetch every page.
    do {
      const query = qs.stringify(
        {
          sort: ["date:desc"],
          populate: ["cover_image", "category"],
          filters: categorySlug
            ? { category: { slug: { $eq: categorySlug } } }
            : {},
          pagination: { page, pageSize: 100 },
        },
        { encodeValuesOnly: true },
      );

      const { data, meta } = await requestJson<{
        data: PostModel[];
        meta: { pagination: { pageCount: number } };
      }>(`${STRAPI_URL}/api/posts?${query}`, {
        revalidate: 60,
        tags: ["posts"],
      });

      posts.push(...data);
      pageCount = meta.pagination.pageCount;
      page += 1;
    } while (page <= pageCount);

    return posts;
  },
  async getPostsPage(
    page: number,
    categorySlug?: string,
  ): Promise<{ posts: PostModel[]; totalPages: number }> {
    const query = qs.stringify(
      {
        sort: ["date:desc"],
        populate: ["cover_image", "category"],
        filters: categorySlug
          ? { category: { slug: { $eq: categorySlug } } }
          : {},
        pagination: { ...getPageRange(page), withCount: true },
      },
      { encodeValuesOnly: true },
    );

    const { data, meta } = await requestJson<{
      data: PostModel[];
      meta: { pagination: { total: number } };
    }>(`${STRAPI_URL}/api/posts?${query}`, {
      revalidate: 60,
      tags: ["posts"],
    });

    return { posts: data, totalPages: getTotalPages(meta.pagination.total) };
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
      { tags: ["categories"] },
    );
  },
  async getPostBySlug(slug: string): Promise<PostModel | null> {
    const { isEnabled: isDraftMode } = await draftMode();

    const query = qs.stringify(
      {
        filters: {
          slug: { $eq: slug },
        },
        populate: {
          cover_image: true,
          category: true,
          content_blocks: {
            on: {
              "content.gallery": {
                populate: {
                  image_gallery: true,
                },
              },
              "content.paragraph-md": true,
            },
          },
        },
        ...(isDraftMode && { status: "draft" }),
      },
      { encodeValuesOnly: true },
    );

    const posts = await requestData<PostModel[]>(
      `${STRAPI_URL}/api/posts?${query}`,
      isDraftMode
        ? { revalidate: false, headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` } }
        : { tags: [`post-${slug}`, "posts"] },
    );

    return posts[0] ?? null;
  },
  async getSocialLinks(): Promise<SocialLinkModel[]> {
    return requestData<SocialLinkModel[]>(
      `${STRAPI_URL}/api/links?populate=icon`,
      { revalidate: 86400, tags: ["social-links"] },
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
  async getAboutMe(includeBlocks: boolean = false): Promise<AboutMeModel> {
    const query = qs.stringify(
      {
        populate: {
          avatar: {
            fields: ["url", "alternativeText"],
          },
          header_image: {
            fields: ["url", "alternativeText"],
          },
          ...(includeBlocks && {
            content_blocks: {
              on: {
                "content.gallery": {
                  populate: {
                    image_gallery: {
                      fields: ["url", "alternativeText", "caption", "width", "height"],
                    },
                  },
                },
                "content.paragraph-md": true,
              },
            },
          }),
        },
        fields: ["title", "bio"],
      },
      { encodeValuesOnly: true },
    );

    return requestData<AboutMeModel>(`${STRAPI_URL}/api/about-me?${query}`, {
      revalidate: 86400, tags: ["about-me"],
    });
  },
  async getCategoryBySlug(slug: string): Promise<CategoryModel | null> {
    const query = qs.stringify(
      {
        filters: {
          slug: { $eq: slug },
        },
        fields: ["name", "slug"],
      },
      { encodeValuesOnly: true },
    );

    const categories = await requestData<CategoryModel[]>(
      `${STRAPI_URL}/api/categories?${query}`,
      { tags: ["categories"] },
    );
    return categories[0] ?? null;
  },
};
