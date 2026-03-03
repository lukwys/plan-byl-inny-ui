import { STRAPI_URL } from "@/config/strapi";
import { requestData } from "@/lib/http/requestData";
import { PostModel } from "@/types/post";
import { HomePageModel } from "@/types/home";
import { getCategories } from "@/server/strapi/categories";
import Image from "next/image";
import { BlogPost } from "@/components/blog-post";
import { AboutMe } from "@/components/about-me";
import { SocialLink } from "@/components/social-link";
import { Category } from "@/components/category";
import { Newsletter } from "@/components/newsletter";
import { strapiService } from "@/services/strapi";

export default async function Home() {
  const homepage = await requestData<HomePageModel>(
    `${STRAPI_URL}/api/homepage?populate=baner`,
  );

  const posts = await requestData<PostModel[]>(
    `${STRAPI_URL}/api/posts?populate=cover_image&populate=category`,
    undefined,
    { revalidate: 60 },
  );

  const socialLinks = await strapiService.getSocialLinks();

  const categories = await getCategories();

  return (
    <div>
      <div className="relative w-full overflow-hidden aspect-[16/9] sm:aspect-[3/1]">
        <Image
          src={`${STRAPI_URL}${homepage.baner.url}`}
          alt={homepage.baner.alternativeText ?? ""}
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
      </div>
      <div className="container mx-auto py-10 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-start-2 lg:col-span-6">
          <h1 className="font-dm-sans font-semibold text-center lg:text-left text-3xl mb-10">
            Odkryj najnowsze wpisy
          </h1>
          <div className="flex flex-col gap-10">
            {posts.map((post) => (
              <BlogPost key={post.documentId} post={post} />
            ))}
          </div>
        </div>
        <div className="block lg:hidden h-px bg-neutral-200 my-4" />
        <div className="lg:col-start-9 lg:col-span-3 flex flex-col gap-20">
          <div>
            <AboutMe />
            <div className="flex gap-3 justify-center mt-3">
              {socialLinks.map((link) => (
                <SocialLink key={link.documentId} socialLink={link} />
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-dm-sans font-semibold text-center text-xl mb-4">
              Kategorie
            </h3>
            <div className="flex flex-col gap-6">
              {categories.map((category) => (
                <Category key={category.documentId} category={category} />
              ))}
            </div>
          </div>
          <Newsletter />
        </div>
      </div>
    </div>
  );
}
