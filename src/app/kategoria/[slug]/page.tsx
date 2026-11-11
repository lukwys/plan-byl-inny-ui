import { PostsPage } from "@/components/posts-page";
import { strapiService } from "@/services/strapi";
import { Params } from "@/types/post";
import { Metadata } from "next";
import { getStrapiImage } from "@/lib/strapi/get-strapi-image";
import { SITE_URL } from "@/config/next";

export async function generateStaticParams() {
  const categories = await strapiService.getCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await strapiService.getCategoryBySlug(slug);

  const title = category ? category.name : slug;
  const imageUrl = getStrapiImage(category?.image?.url ?? null) || `${SITE_URL}/logo.png`;

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

  const [{ posts, totalPages }, category] = await Promise.all([
    strapiService.getPostsPage(1, slug),
    strapiService.getCategoryBySlug(slug),
  ]);

  const categoryName = category?.name || slug;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: categoryName,
    description: `Wpisy z kategorii ${categoryName} na blogu Plan był inny`,
    url: `${SITE_URL}/kategoria/${slug}`,
    itemListElement: posts.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/wpis/${post.slug}`,
      name: post.title,
    })),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PostsPage
        title={categoryName}
        fallbackTitle={categoryName}
        posts={posts}
        currentPage={1}
        totalPages={totalPages}
        basePath={`/kategoria/${slug}`}
        emptyMessage="Brak wpisów w tej kategorii."
      />
    </div>
  );
}
