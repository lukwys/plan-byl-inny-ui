import Image from "next/image";
import Link from "next/link";
import { STRAPI_URL } from "@/config/strapi";
import { requestData } from "@/lib/http/requestData";
import { AboutMeModel } from "@/types/about-me";

export const AboutMe = async () => {
  const { avatar, title, bio } = await requestData<AboutMeModel>(
    `${STRAPI_URL}/api/about-me?populate=avatar`,
  );

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative w-[150px] h-[150px] mb-12 overflow-hidden rounded-full">
        <Image
          src={`${STRAPI_URL}${avatar.url}`}
          alt={avatar.alternativeText ?? ""}
          fill
          className="object-cover object-center"
          sizes="150px"
          priority
        />
      </div>
      <h3 className="font-dm-sans text-xl font-semibold mb-2.5">{title}</h3>
      <p className="font-eb-garamond mb-2.5">{bio}</p>
      <Link
        href="/about"
        className="font-eb-garamond text-main-red font-medium hover:text-main-red-hover"
      >
        dowiedz się więcej →
      </Link>
    </div>
  );
};
