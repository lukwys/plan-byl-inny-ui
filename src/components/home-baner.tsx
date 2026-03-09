import Image from "next/image";
import { strapiService } from "@/services/strapi";
import { getStrapiImage } from "@/lib/strapi/get-strapi-image";

export const HomeBaner = async () => {
  const { baner } = await strapiService.getHomepage();

  return (
    <div className="relative w-full overflow-hidden aspect-[16/9] sm:aspect-[3/1]">
      <Image
        src={getStrapiImage(baner.url)}
        alt={baner.alternativeText ?? ""}
        fill
        className="object-cover object-center"
        priority
        sizes="100vw"
      />
    </div>
  );
};
