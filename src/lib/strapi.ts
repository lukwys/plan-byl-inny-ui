import { Post } from "@/types/post"
import { StrapiResponse } from "@/types/strapi"

export const getPosts = async (): Promise<Post[]> => {
  const data = await fetch('http://localhost:1337/api/posts?populate=cover_image')

  const { data: posts } = await data.json()

  return posts
}
