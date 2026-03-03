import { SocialLink } from "@/components/social-link";
import { STRAPI_URL } from "@/config/strapi";
import { requestData } from "@/lib/http/requestData";
import { strapiService } from "@/services/strapi";
import { AboutMeModel } from "@/types/about-me";
import Image from "next/image";

const AboutMe = async () => {
  const { header_image, title, bio, avatar } = await requestData<AboutMeModel>(
    `${STRAPI_URL}/api/about-me?populate=*`,
  );

  const socialLinks = await strapiService.getSocialLinks();

  return (
    <div>
      <div className="relative w-full h-[350px]">
        <h1 className="absolute inset-0 z-10 flex items-center justify-center text-white font-dm-sans font-semibold text-6xl text-center">
          O mnie
        </h1>
        <Image
          src={`${STRAPI_URL}${header_image.url}`}
          alt={header_image.alternativeText ?? ""}
          className="object-cover"
          priority
          sizes="100vw"
          fill
        />
      </div>
      <div className="grid gap-10 py-10 max-w-7xl mx-auto lg:grid-cols-12">
        <div className="order-2 px-4 lg:px-0 lg:order-none lg:col-start-2 lg:col-span-5">
          <p className="font-dm-sans font-semibold mb-2.5">{title}</p>
          <p className="font-eb-garamond mb-2.5">{bio}</p>
          <div className="flex gap-3 mt-3">
            {socialLinks.map((link) => (
              <SocialLink key={link.documentId} socialLink={link} />
            ))}
          </div>
        </div>
        <div className="order-1 relative mx-auto mb-12 aspect-square w-[300px] lg:order-none lg:col-start-8 lg:col-span-3 lg:w-[500px]">
          <Image
            src={`${STRAPI_URL}${avatar.url}`}
            alt={avatar.alternativeText ?? ""}
            fill
            priority
            className="object-cover object-center"
            sizes="(min-width: 1024px) 500px, 300px"
          />
        </div>
      </div>
    </div>
  );
};

export default AboutMe;
