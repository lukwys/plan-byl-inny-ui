import { BlogPost } from "@/components/blog-post";
import { strapiService } from "@/services/strapi";
import { HomeBaner } from "@/components/home-baner";
import { Sidebar } from "@/components/sidebar";

export default async function Home() {
  const posts = await strapiService.getPosts();

  return (
    <div>
      <HomeBaner />
      <div className="container mx-auto bg-white py-10 grid gap-10 lg:grid-cols-24">
        <div className="lg:col-start-2 lg:col-span-15">
          <h1 className="font-dm-sans font-semibold text-center lg:text-left text-3xl mb-10">
            {posts.length === 0
              ? "Pierwsze wpisy pojawią się już niebawem! "
              : "Odkryj najnowsze wpisy"}
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
