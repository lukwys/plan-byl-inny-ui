import { PostModel } from "@/types/post";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/dates/format-date";
import { getStrapiImage } from "@/lib/strapi/get-strapi-image";
import { PostInfo } from "./post-info";

type BlogPostProps = {
  post: PostModel;
};

export const BlogPost = ({ post }: BlogPostProps) => {
  const { cover_image, title, preview, date, slug, category } = post;

  return (
    <div>
      <div className="relative h-[350px] w-full">
        <Image
          src={getStrapiImage(cover_image.url)}
          alt={cover_image.alternativeText ?? ""}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 950px"
        />
      </div>
      <div className="bg-gray-50">
        <div className="w-3/4 mx-auto py-10 flex flex-col gap-2.5 text-center">
          <h3 className="font-dm-sans text-2xl font-semibold">{title}</h3>
          <PostInfo category={category} date={date} />
          <p className="font-eb-garamond text-lg">{preview}</p>
          <Link
            href={`/wpis/${slug}`}
            className="font-eb-garamond text-main-red hover:text-main-red-hover"
          >
            czytaj →
          </Link>
        </div>
      </div>
    </div>
  );
};
