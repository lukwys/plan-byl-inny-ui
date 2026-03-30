import ReactMarkdown from "react-markdown";
import Image from "next/image";
import { Comments } from "@/components/comments/comments";
import { notFound } from "next/navigation";
import { Params } from "@/types/post";
import { Gallery } from "@/components/gallery";
import { AuthorNote } from "@/components/author-note";
import { strapiService } from "@/services/strapi";
import { getStrapiImage } from "@/lib/strapi/get-strapi-image";
import { Sidebar } from "@/components/sidebar";
import { PostInfo } from "@/components/post-info";
import { Metadata } from "next";
import { SITE_URL } from "@/config/next";

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await strapiService.getPostBySlug(slug);

  if (!post) return {};

  const fullImageUrl = getStrapiImage(post.cover_image.url);

  return {
    title: `${post.title} | Plan był inny`,
    description:
      post.preview ||
      `Odkryj wpis: ${post.title} na blogu Plan był inny. Pasja, podróże i projekty DIY.`,
    openGraph: {
      title: post.title,
      description: post.preview,
      images: [{ url: fullImageUrl, width: 1200, height: 630 }],
      type: "article",
      publishedTime: post.date,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.preview,
      images: [fullImageUrl],
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await strapiService.getPostBySlug(slug);

  if (!post) notFound();

  const comments = await strapiService.getPublishedComments(post.documentId);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    image: getStrapiImage(post.cover_image.url),
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: "Łukasz",
      url: `${SITE_URL}/o-mnie`,
    },
  };

  return (
    <main className="mx-auto container bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-2xl">
        <Image
          src={getStrapiImage(post.cover_image.url)}
          alt={post.cover_image.alternativeText || post.title} // Fallback alt
          fill
          className="object-cover"
          priority
          sizes="(min-width: 1280px) 1280px, 100vw"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/30">
          <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold text-center px-6">
            {post.title}
          </h1>
          <div className="bg-white p-2 mt-2">
            <PostInfo category={post.category} date={post.date} />
          </div>
        </div>
      </header>
      <div className="py-10 grid gap-10 lg:grid-cols-24 px-4 lg:px-0">
        <div className="lg:col-span-15 lg:col-start-2">
          <article className="markdown">
            {post.content_blocks.map((block) => {
              switch (block.__component) {
                case "content.paragraph-md":
                  return (
                    <div key={block.id}>
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => {
                            if (
                              typeof children === "string" &&
                              children.startsWith("::: ")
                            ) {
                              return <AuthorNote>{children}</AuthorNote>;
                            }

                            return (
                              <p className="font-eb-garamond text-lg mb-6 last:mb-0 leading-relaxed">
                                {children}
                              </p>
                            );
                          },
                          blockquote: ({ children }) => (
                            <blockquote
                              className="font-eb-garamond my-6 px-6 py-4 italic rounded-r-xl shadow-sm border-l-4 border-[var(--color-main-red)]"
                              style={{
                                backgroundColor: "oklch(0.97 0.02 25.17)",
                                color: "oklch(0.30 0.05 25.17)",
                              }}
                            >
                              {children}
                            </blockquote>
                          ),
                        }}
                      >
                        {block.paragraph}
                      </ReactMarkdown>
                    </div>
                  );
                case "content.gallery": {
                  return <Gallery key={block.id} block={block} />;
                }
                default:
                  return null;
              }
            })}
          </article>
          <section className="mt-16 border-t pt-10">
            <Comments
              postDocumentId={post.documentId}
              comments={comments}
              postTitle={post.title}
            />
          </section>
        </div>
        <aside className="lg:col-start-18 lg:col-span-6">
          <div className="block lg:hidden h-px bg-neutral-200 my-8" />
          <Sidebar />
        </aside>
      </div>
    </main>
  );
}
