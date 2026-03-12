import { strapiService } from "@/services/strapi";
import { AboutMe } from "./about-me";
import { SocialLink } from "./social-link";
import { Divider } from "./divider";
import { Category } from "./category";
import { Newsletter } from "./newsletter";

export const Sidebar = async () => {
  const socialLinks = await strapiService.getSocialLinks();
  const categories = await strapiService.getCategories();

  return (
    <div className="lg:col-start-18 lg:col-span-6 flex flex-col">
      <div>
        <AboutMe />
        <div className="flex gap-3 justify-center mt-3">
          {socialLinks.map((link) => (
            <SocialLink key={link.documentId} socialLink={link} />
          ))}
        </div>
      </div>
      <Divider />
      {categories.length > 0 && (
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
      )}
      <Divider />
      <Newsletter />
    </div>
  );
};
