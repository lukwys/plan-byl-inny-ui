import { BlogPost } from "@/components/blog-post";
import { strapiService } from "@/services/strapi";
import { HomeBaner } from "@/components/home-baner";
import { Params } from "@/types/post";
import { Sidebar } from "@/components/sidebar";

export default async function CategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const posts = await strapiService.getPosts(slug);

  return (
    <div>
      <HomeBaner />
      <div className="container mx-auto bg-white py-10 grid gap-10 lg:grid-cols-24">
        <div className="lg:col-start-2 lg:col-span-15">
          <h1 className="font-dm-sans font-semibold text-center lg:text-left text-3xl mb-10">
            Odkryj najnowsze wpisy z wybranej kategorii
          </h1>
          <div className="flex flex-col gap-10">
            {posts.map((post) => (
              <BlogPost key={post.documentId} post={post} />
            ))}
          </div>
        </div>
        <div className="block lg:hidden h-px bg-neutral-200 my-4" />
        <Sidebar />
      </div>
    </div>
  );
}
