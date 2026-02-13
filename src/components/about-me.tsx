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
          alt="Zdjęcie o mnie"
          fill
          className="object-cover object-center"
          sizes="150px"
          priority
        />
      </div>
      <p className="font-dm-sans font-semibold mb-2.5">{title}</p>
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
