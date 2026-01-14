import { Post } from "@/types/post"
import Image from 'next/image'
import Link from "next/link"

type BlogPostProps = {
  post: Post
}

export const BlogPost = async ({ post }: BlogPostProps) => {
  return (
    <div>
      <div className="h-[350]">
        <Image
          src={`http://127.0.0.1:1337${post.cover_image.url}`}
          alt="Zdjęcie o mnie"
          width={950}
          height={350}
          className="h-full"
        />
      </div>
      <div className="bg-gray-50">
        <div className="w-3/4 mx-auto py-10 flex flex-col gap-2.5 text-center">
        <h3 className="font-dm-sans text-2xl font-semibold">{post.title}</h3>
        <p className="font-eb-garamond text-lg">{post.preview}</p>
        <Link href={`/posts/${post.slug}`}>
          czytaj →
        </Link>
        </div>
      </div>
    </div>
  )
}
