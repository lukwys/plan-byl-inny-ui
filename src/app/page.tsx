import { AboutMe } from "@/components/about-me";
import Image from "next/image";
import { BlogPost } from "@/components/blog-post";
import { STRAPI_URL } from "@/config/strapi";
import { requestData } from "@/lib/http/requestData";
import { PostModel } from "@/types/post";
import { HomeModel } from "@/types/home";

export default async function Home() {
  const homepage = await requestData<HomeModel>(
    `${STRAPI_URL}/api/homepage?populate=baner`,
  );

  const posts = await requestData<PostModel[]>(
    `${STRAPI_URL}/api/posts?populate=cover_image`,
  );

  return (
    <div>
      <div className="mt-6">
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
      </div>
      <div className="container grid grid-cols-12 py-10 mx-auto">
        <div className="col-start-2 col-span-6 flex flex-col gap-10">
          {posts.map((post) => (
            <BlogPost key={post.id} post={post} />
          ))}
        </div>
        <div className="col-start-9 col-span-3">
          <AboutMe />
        </div>
      </div>
    </div>
  );
}
