import { STRAPI_URL } from "@/config/strapi";
import { requestData } from "@/lib/http/requestData";
import { AboutMeModel } from "@/types/about-me";
import Image from "next/image";

const AboutMe = async () => {
  const { header_image, title, bio, avatar } = await requestData<AboutMeModel>(
    `${STRAPI_URL}/api/about-me?populate=*`,
  );

  return (
    <div>
      <div className="relative w-full h-[350px]">
        <h1 className="absolute inset-0 z-10 flex items-center justify-center text-white font-dm-sans font-semibold text-6xl text-center">
          O mnie
        </h1>
        <Image
          src={`${STRAPI_URL}${header_image.url}`}
          alt="Zdjęcie o mnie"
          className="object-cover"
          priority
          sizes="100vw"
          fill
        />
      </div>
      <div className="grid gap-10 py-10 max-w-7xl mx-auto lg:grid-cols-12">
        <div className="flex justify-center lg:col-start-8 lg:col-span-3">
          <div className="relative w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] mb-12">
            <Image
              src={`${STRAPI_URL}${avatar.url}`}
              alt="Zdjęcie o mnie"
              className="object-cover object-center"
              sizes="(max-width: 1024px) 300px, 500px"
              fill
              priority
            />
          </div>
        </div>

        <div className="px-4 lg:px-0 lg:col-start-2 lg:col-span-5">
          <p className="font-dm-sans font-semibold mb-2.5">{title}</p>
          <p className="font-eb-garamond mb-2.5">{bio}</p>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;
