import { PostModel } from "@/types/post";
import Image from "next/image";
import Link from "next/link";
import { STRAPI_URL } from "@/config/strapi";

type BlogPostProps = {
  post: PostModel;
};

export const BlogPost = ({ post }: BlogPostProps) => {
  return (
    <div>
      <div className="relative h-[350px] w-full">
        <Image
          src={`${STRAPI_URL}${post.cover_image.url}`}
          alt={post.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 950px"
        />
      </div>

      <div className="bg-gray-50">
        <div className="w-3/4 mx-auto py-10 flex flex-col gap-2.5 text-center">
          <h3 className="font-dm-sans text-2xl font-semibold">{post.title}</h3>
          <p className="font-eb-garamond text-lg">{post.preview}</p>
          <Link
            href={`/posts/${post.slug}`}
            className="font-dm-sans font-medium underline underline-offset-4"
          >
            czytaj →
          </Link>
        </div>
      </div>
    </div>
  );
};
