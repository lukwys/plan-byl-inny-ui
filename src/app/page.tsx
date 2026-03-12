import { BlogPost } from "@/components/blog-post";
import { strapiService } from "@/services/strapi";
import { HomeBaner } from "@/components/home-baner";
import { Sidebar } from "@/components/sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plan był inny - Blog o podróżach i przygodach",
  description:
    "Bikepacking, nurkowanie i wyprawy bez sztywnego planu. Wejdź do świata Łukasza i zobacz, gdzie kończą się plany, a zaczyna przygoda.",
};

export default async function Home() {
  const posts = await strapiService.getPosts();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Plan był inny",
    url: "https://plan-byl-inny.pl",
    description: "Blog o podróżach, rowerze, nurkowaniu i DIY",
    author: {
      "@type": "Person",
      name: "Łukasz",
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HomeBaner />

      <div className="container mx-auto bg-white py-10 grid gap-10 lg:grid-cols-24 px-4 lg:px-0">
        <div className="lg:col-start-2 lg:col-span-15">
          <h1 className="font-dm-sans font-semibold text-center lg:text-left text-3xl mb-10">
            {posts.length === 0
              ? "Cisza przed burzą... Wpisy są w drodze!"
              : "Odkryj najnowsze wpisy z bloga"}
          </h1>

          <div className="flex flex-col gap-10">
            {posts.map((post) => (
              <BlogPost key={post.documentId} post={post} />
            ))}
          </div>
        </div>

        <aside className="lg:col-start-18 lg:col-span-6">
          <div className="block lg:hidden h-px bg-neutral-200 my-4" />
          <Sidebar />
        </aside>
      </div>
    </main>
  );
}
