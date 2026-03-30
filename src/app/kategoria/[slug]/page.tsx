import { BlogPost } from "@/components/blog-post";
import { strapiService } from "@/services/strapi";
import { HomeBaner } from "@/components/home-baner";
import { Params } from "@/types/post";
import { Sidebar } from "@/components/sidebar";
import { Metadata } from "next";
import { getStrapiImage } from "@/lib/strapi/get-strapi-image";

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await strapiService.getCategoryBySlug(slug);

  const title = category ? category.name : slug;
  const imageUrl = getStrapiImage(category?.image?.url ?? null);

  return {
    title: `${title} | Plan był inny`,
    description: `Odkryj wszystkie wpisy z kategorii ${title} na blogu Plan był inny.`,
    openGraph: {
      title: `${title} - Blog Plan był inny`,
      description: `Sprawdź nasze wpisy w kategorii: ${title}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `Kategoria ${title} na blogu Plan był inny`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} - Blog Plan był inny`,
      description: `Sprawdź nasze wpisy w kategorii: ${title}`,
      images: [imageUrl],
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;

  const [posts, category] = await Promise.all([
    strapiService.getPosts(slug),
    strapiService.getCategoryBySlug(slug),
  ]);

  const categoryName = category?.name || slug;

  return (
    <div>
      <HomeBaner />
      <div className="container mx-auto bg-white py-10 grid gap-10 lg:grid-cols-24">
        <div className="lg:col-start-2 lg:col-span-15">
          <h1 className="font-dm-sans font-semibold text-center lg:text-left text-3xl mb-10">
            Odkryj najnowsze wpisy z kategorii:{" "}
            <span className="text-main-red">{categoryName.toUpperCase()}</span>
          </h1>
          <div className="flex flex-col gap-10">
            {posts.length > 0 ? (
              posts.map((post) => (
                <BlogPost key={post.documentId} post={post} />
              ))
            ) : (
              <p className="text-center text-gray-500">
                Brak wpisów w tej kategorii.
              </p>
            )}
          </div>
        </div>
        <div className="block lg:hidden h-px bg-neutral-200 my-4" />
        <aside className="lg:col-start-18 lg:col-span-6">
          <div className="block lg:hidden h-px bg-neutral-200 my-4" />
          <Sidebar />
        </aside>
      </div>
    </div>
  );
}
