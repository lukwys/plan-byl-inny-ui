import { AboutMe } from "@/components/about-me";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import { Comments } from "@/components/comments/comments";
import { getPublishedComments } from "@/lib/comments/get-published-comments";
import { STRAPI_URL } from "@/config/strapi";
import { getPostBySlug } from "@/server/strapi/posts";
import { notFound } from "next/navigation";
import { Params } from "@/types/post";
import { Gallery } from "@/components/gallery";
import { requestData } from "@/lib/http/requestData";
import { SocialLinkModel } from "@/types/social-link";
import { SocialLink } from "@/components/social-link";

export default async function PostPage({ params }: { params: Params }) {
  const post = await getPostBySlug(params.slug);
  const socialLinks = await requestData<SocialLinkModel[]>(
    `${STRAPI_URL}/api/links?populate=icon`,
  );

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
                    <div key={block.id}>
                      <ReactMarkdown
                        components={{
                          p: ({ children, ...props }) => (
                            <p
                              className="font-eb-garamond text-lg text-justify"
                              {...props}
                            >
                              {children}
                            </p>
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
          <Comments postDocumentId={post.documentId} comments={comments} />
        </div>
        <div className="block lg:hidden h-px bg-neutral-200 my-4" />
        <div className="lg:col-start-10 lg:col-span-3">
          <AboutMe />
          <div className="flex gap-3 justify-center mt-3">
            {socialLinks.map((link) => (
              <SocialLink key={link.documentId} socialLink={link} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
