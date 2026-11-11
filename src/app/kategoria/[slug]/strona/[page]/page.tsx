import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";
import { strapiService } from "@/services/strapi";
import { PostsPage } from "@/components/posts-page";
import { parsePageParam } from "@/lib/posts/pagination";

type PageParams = { slug: string; page: string };

export async function generateStaticParams() {
  const categories = await strapiService.getCategories();

  const params = await Promise.all(
    categories.map(async ({ slug }) => {
      const { totalPages } = await strapiService.getPostsPage(1, slug);
      return Array.from({ length: Math.max(totalPages - 1, 0) }, (_, index) => ({
        slug,
        page: String(index + 2),
      }));
    }),
  );

  return params.flat();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { slug, page } = await params;
  const category = await strapiService.getCategoryBySlug(slug);

  return {
    title: `${category?.name ?? slug} – strona ${page} | Plan był inny`,
  };
}

export default async function CategoryArchivePage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug, page: pageParam } = await params;
  const page = parsePageParam(pageParam);

  if (page === 1) redirect(`/kategoria/${slug}`);
  if (!page) notFound();

  const [{ posts, totalPages }, category] = await Promise.all([
    strapiService.getPostsPage(page, slug),
    strapiService.getCategoryBySlug(slug),
  ]);

  if (!category || page > totalPages) notFound();

  const title = `${category.name} – strona ${page}`;

  return (
    <main>
      <PostsPage
        title={title}
        fallbackTitle={title}
        posts={posts}
        currentPage={page}
        totalPages={totalPages}
        basePath={`/kategoria/${slug}`}
        emptyMessage=""
      />
    </main>
  );
}
