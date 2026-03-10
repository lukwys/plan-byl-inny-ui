import { AboutMe } from "@/components/about-me";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import { Comments } from "@/components/comments/comments";
import { notFound } from "next/navigation";
import { Params } from "@/types/post";
import { Gallery } from "@/components/gallery";
import { SocialLink } from "@/components/social-link";
import { Category } from "@/components/category";
import { Newsletter } from "@/components/newsletter";
import { AuthorNote } from "@/components/author-note";
import { strapiService } from "@/services/strapi";
import { getStrapiImage } from "@/lib/strapi/get-strapi-image";

export default async function PostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await strapiService.getPostBySlug(slug);
  const socialLinks = await strapiService.getSocialLinks();
  const categories = await strapiService.getCategories();

  if (!post) notFound();

  const comments = await strapiService.getPublishedComments(post.documentId);

  return (
    <div>
      <div className="relative w-full h-[600px]">
        <Image
          src={getStrapiImage(post.cover_image.url)}
          alt={post.cover_image.alternativeText ?? ""}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-white text-4xl font-bold">{post.title}</h1>
        </div>
      </div>
      <div className="container mx-auto py-10 grid gap-10 lg:grid-cols-12  px-4 lg:px-0">
        <div className="lg:col-span-8">
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
        <div className="lg:col-start-10 lg:col-span-3 flex flex-col gap-20">
          <div>
            <AboutMe />
            <div className="flex gap-3 justify-center mt-3">
              {socialLinks.map((link) => (
                <SocialLink key={link.documentId} socialLink={link} />
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-dm-sans font-semibold text-center text-xl mb-4">
              Kategorie
            </h3>
            <div className="flex flex-col gap-6">
              {categories.map((category) => (
                <Category key={category.documentId} category={category} />
              ))}
            </div>
          </div>
          <Newsletter />
        </div>
      </div>
    </div>
  );
}
