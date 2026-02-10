import { AboutMe } from "@/components/about-me";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import { Comments } from "@/components/comments/comments";
import { getPublishedComments } from "@/lib/comments/get-published-comments";
import { STRAPI_URL } from "@/config/strapi";
import { getPostBySlug } from "@/server/strapi/posts";
import { notFound } from "next/navigation";
import { Params } from "@/types/post";

export default async function PostPage({ params }: { params: Params }) {
  const post = await getPostBySlug(params.slug);

  if (!post) notFound();

  const comments = await getPublishedComments(post.documentId);

  return (
    <div>
      <div className="relative w-full h-[600px]">
        <Image
          src={`${STRAPI_URL}${post.cover_image.url}`}
          alt={post.title}
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
                    <div key={block.id} className="prose max-w-none">
                      <ReactMarkdown>{block.paragraph}</ReactMarkdown>
                    </div>
                  );
                case "content.gallery":
                  return (
                    <div
                      key={block.id}
                      className={`my-6 grid gap-4 ${
                        block.cols === "three"
                          ? "grid-cols-1 sm:grid-cols-3"
                          : block.cols === "one"
                            ? "grid-cols-1"
                            : "grid-cols-1 sm:grid-cols-2"
                      }`}
                    >
                      {block.image_gallery?.map((img) => (
                        <Image
                          key={img.id}
                          src={`${STRAPI_URL}${img.url}`}
                          alt={img.alternativeText ?? ""}
                          width={img.width}
                          height={img.height}
                          className="w-full h-auto rounded-xl"
                        />
                      ))}
                    </div>
                  );
                default:
                  return null;
              }
            })}
          </article>
          <Comments postDocumentId={post.documentId} comments={comments} />
        </div>
        <div className="block lg:hidden h-px bg-neutral-200 my-4" />
        <div className="lg:col-start-10 lg:col-span-3">
          <AboutMe />
        </div>
      </div>
    </div>
  );
}
