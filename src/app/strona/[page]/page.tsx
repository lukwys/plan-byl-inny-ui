import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";
import { strapiService } from "@/services/strapi";
import { PostsPage } from "@/components/posts-page";
import { parsePageParam } from "@/lib/posts/pagination";

type PageParams = { page: string };

export async function generateStaticParams() {
  const { totalPages } = await strapiService.getPostsPage(1);
  return Array.from({ length: Math.max(totalPages - 1, 0) }, (_, index) => ({
    page: String(index + 2),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { page } = await params;

  return {
    title: `Starsze wpisy – strona ${page} | Plan był inny`,
  };
}

export default async function PostsArchivePage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const page = parsePageParam((await params).page);

  if (page === 1) redirect("/");
  if (!page) notFound();

  const { posts, totalPages } = await strapiService.getPostsPage(page);

  if (page > totalPages) notFound();

  return (
    <main>
      <PostsPage
        title={`Starsze wpisy – strona ${page}`}
        fallbackTitle={`Starsze wpisy – strona ${page}`}
        posts={posts}
        currentPage={page}
        totalPages={totalPages}
        basePath=""
        emptyMessage=""
      />
    </main>
  );
}
