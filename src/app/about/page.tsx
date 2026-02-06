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
      <div className="grid grid-cols-12 py-10 max-w-7xl mx-auto">
        <div className="col-start-2 col-span-5">
          <p className="font-dm-sans font-semibold mb-2.5">{title}</p>
          <p className="font-eb-garamond mb-2.5">{bio}</p>
        </div>
        <div className="col-start-8 col-span-3">
          <div className="relative w-[500px] h-[500px] mb-12">
            <Image
              src={`${STRAPI_URL}${avatar.url}`}
              alt="Zdjęcie o mnie"
              className="object-cover object-center"
              priority
              sizes="500px"
              fill
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutMe;
