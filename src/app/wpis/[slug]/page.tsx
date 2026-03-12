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

export default async function PostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await strapiService.getPostBySlug(slug);

  if (!post) notFound();

  const comments = await strapiService.getPublishedComments(post.documentId);

  return (
    <div className="mx-auto container bg-white">
      <div className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-2xl">
        <Image
          src={getStrapiImage(post.cover_image.url)}
          alt={post.cover_image.alternativeText ?? ""}
          fill
          className="object-cover"
          priority
          sizes="(min-width: 1280px) 1280px, 100vw"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold text-center px-6">
            {post.title}
          </h1>
        </div>
      </div>
      <div className="py-10 grid gap-10 lg:grid-cols-24  px-4 lg:px-0">
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
                              <p className="font-eb-garamond text-lg text-justify mb-4 last:mb-0">
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
          <Comments
            postDocumentId={post.documentId}
            comments={comments}
            postTitle={post.title}
          />
        </div>
        <div className="block lg:hidden h-px bg-neutral-200 my-4" />
        <Sidebar />
      </div>
    </div>
  );
}
