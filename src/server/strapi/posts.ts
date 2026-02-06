import { STRAPI_URL } from "@/config/strapi";
import { requestData } from "@/lib/http/requestData";
import { PostPageModel } from "@/types/post";
import qs from "qs";

export async function getPostBySlug(
  slug: string,
): Promise<PostPageModel | null> {
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
  );

  return posts[0] ?? null;
}
