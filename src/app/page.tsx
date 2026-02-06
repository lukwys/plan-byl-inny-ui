import { AboutMe } from "@/components/about-me";
import Image from "next/image";
import { BlogPost } from "@/components/blog-post";
import { STRAPI_URL } from "@/config/strapi";
import { requestData } from "@/lib/http/requestData";
import { PostModel } from "@/types/post";
import { HomePageModel } from "@/types/home";
import { getCategories } from "@/server/strapi/categories";
import { Category } from "@/components/category";

export default async function Home() {
  const homepage = await requestData<HomePageModel>(
    `${STRAPI_URL}/api/homepage?populate=baner`,
  );

  const posts = await requestData<PostModel[]>(
    `${STRAPI_URL}/api/posts?populate=cover_image`,
  );

  const categories = await getCategories();

  console.log("categories", categories);

  return (
    <div>
      <div className="relative w-full overflow-hidden aspect-[16/9] sm:aspect-[3/1]">
        <Image
          src={`${STRAPI_URL}${homepage.baner.url}`}
          alt="Baner"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
      </div>
      <div className="container mx-auto py-10 grid gap-10 lg:grid-cols-12">
        <div className="flex flex-col gap-10 lg:col-start-2 lg:col-span-6">
          {posts.map((post) => (
            <BlogPost key={post.documentId} post={post} />
          ))}
        </div>
        <div className="block lg:hidden h-px bg-neutral-200 my-4" />
        <div className="lg:col-start-9 lg:col-span-3 flex flex-col gap-20">
          <AboutMe />
          <div className="flex flex-col gap-6">
            {categories.map((category) => (
              <Category key={category.documentId} category={category} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
