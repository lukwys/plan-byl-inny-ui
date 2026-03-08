import { BlogPost } from "@/components/blog-post";
import { AboutMe } from "@/components/about-me";
import { SocialLink } from "@/components/social-link";
import { Category } from "@/components/category";
import { Newsletter } from "@/components/newsletter";
import { strapiService } from "@/services/strapi";
import { HomeBaner } from "@/components/home-baner";
import { Params } from "@/types/post";

export default async function CategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const posts = await strapiService.getPosts(slug);
  const socialLinks = await strapiService.getSocialLinks();
  const categories = await strapiService.getCategories();

  return (
    <div>
      <HomeBaner />
      <div className="container mx-auto py-10 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-start-2 lg:col-span-6">
          <h1 className="font-dm-sans font-semibold text-center lg:text-left text-3xl mb-10">
            Odkryj najnowsze wpisy z wybranej kategorii
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
