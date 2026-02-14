import { PostModel } from "@/types/post";
import Image from "next/image";
import Link from "next/link";
import { STRAPI_URL } from "@/config/strapi";
import { formatDate } from "@/lib/dates/format-date";

type BlogPostProps = {
  post: PostModel;
};

export const BlogPost = ({ post }: BlogPostProps) => {
  const { cover_image, title, preview, date, slug, category } = post;

  return (
    <div>
      <div className="relative h-[350px] w-full">
        <Image
          src={`${STRAPI_URL}${cover_image.url}`}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 950px"
        />
      </div>

      <div className="bg-gray-50">
        <div className="w-3/4 mx-auto py-10 flex flex-col gap-2.5 text-center">
          <h3 className="font-dm-sans text-2xl font-semibold">{title}</h3>
          <div className="flex justify-center text-xs">
            <Link
              href={`/category/${category?.slug}`}
              className="hover:text-main-red"
            >
              <p className="text-main-red">{category?.name.toUpperCase()}</p>
            </Link>
            <p> • </p>
            <p>{formatDate(date)}</p>
          </div>
          <p className="font-eb-garamond text-lg">{preview}</p>
          <Link
            href={`/posts/${slug}`}
            className="font-eb-garamond hover:text-main-red"
          >
            czytaj →
          </Link>
        </div>
      </div>
    </div>
  );
};
