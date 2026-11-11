import { PostModel } from "@/types/post";
import Image from "next/image";
import Link from "next/link";
import { getStrapiImage } from "@/lib/strapi/get-strapi-image";
import { PostInfo } from "./post-info";

type BlogPostProps = {
  post: PostModel;
  featured?: boolean;
};

export const BlogPost = ({ post, featured = false }: BlogPostProps) => {
  const { cover_image, title, preview, date, slug, category } = post;

  return (
    <article
      className={`group relative grid content-start ${featured ? "" : "row-span-4 grid-rows-subgrid gap-y-0 pb-12"}`}
    >
      <div
        className={`relative mb-4 w-full overflow-hidden rounded-xl ${featured ? "aspect-[16/9]" : "aspect-[3/2]"}`}
      >
        <Image
          src={getStrapiImage(cover_image.url)}
          alt={cover_image.alternativeText ?? ""}
          fill
          className="object-cover"
          sizes={
            featured
              ? "(max-width: 1024px) 100vw, 800px"
              : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
          }
          priority={featured}
        />
      </div>
      <div className="mb-2">
        <PostInfo category={category} date={date} align="start" />
      </div>
      <h2
        className={`mb-2 font-dm-sans font-semibold leading-tight text-balance transition-colors group-hover:text-main-red ${featured ? "text-2xl md:text-3xl" : "text-xl"}`}
      >
        <Link
          href={`/wpis/${slug}`}
          className="after:absolute after:inset-0 after:content-['']"
        >
          {title}
        </Link>
      </h2>
      <p
        className={`font-eb-garamond leading-relaxed text-neutral-700 ${featured ? "text-lg md:text-xl" : "text-lg"}`}
      >
        {preview}
      </p>
    </article>
  );
};
