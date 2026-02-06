import Link from "next/link";
import Image from "next/image";
import { STRAPI_URL } from "@/config/strapi";
import { CategoryModel } from "@/types/category";

type CategoryProps = {
  category: CategoryModel;
};

export const Category = ({ category }: CategoryProps) => {
  const { name, slug, image } = category;

  return (
    <Link
      href={`/category/${slug}`}
      className="relative block w-full overflow-hidden py-10"
      aria-label={`Kategoria: ${name}`}
    >
      <div className="absolute inset-0">
        {image?.url ? (
          <Image
            src={`${STRAPI_URL}${image.url}`}
            alt=""
            fill
            className="object-cover opacity-70"
            sizes="100vw"
            priority
          />
        ) : (
          <div className="h-full w-full bg-neutral-200" />
        )}
      </div>
      <div className="relative z-10 flex justify-center">
        <div className="w-1/2 flex justify-center py-3 bg-white/80">
          <p className="text-main-red">{name.toUpperCase()}</p>
        </div>
      </div>
    </Link>
  );
};
