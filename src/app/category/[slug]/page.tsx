import { STRAPI_URL } from "@/config/strapi";
import { requestData } from "@/lib/http/requestData";
import { PostModel } from "@/types/post";
import { HomePageModel } from "@/types/home";
import { getCategories } from "@/server/strapi/categories";
import { PostsListing } from "@/components/posts/posts-listing";

export default async function Category({
  params,
}: {
  params: { slug: string };
}) {
  const qs =
    `populate=cover_image&populate=category` +
    `&filters[category][slug][$eq]=${encodeURIComponent(params.slug)}`;

  const homepage = await requestData<HomePageModel>(
    `${STRAPI_URL}/api/homepage?populate=baner`,
  );

  const posts = await requestData<PostModel[]>(`${STRAPI_URL}/api/posts?${qs}`);

  const categories = await getCategories();

  return (
    <PostsListing homepage={homepage} posts={posts} categories={categories} />
  );
}
