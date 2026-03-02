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
      className="group relative block w-full overflow-hidden py-10"
      aria-label={`Kategoria: ${name}`}
    >
      <div className="absolute inset-0">
        {image?.url ? (
          <Image
            src={`${STRAPI_URL}${image.url}`}
            alt={image.alternativeText ?? ""}
            fill
            className="object-cover opacity-70 transition-opacity duration-300 group-hover:opacity-90"
            sizes="100vw"
            priority
          />
        ) : (
          <div className="h-full w-full bg-neutral-200" />
        )}
      </div>
      <div className="relative z-10 flex justify-center">
        <div className="flex w-1/2 justify-center bg-white/80 py-3">
          <p className="text-main-red transition-colors group-hover:text-main-red-hover">
            {name.toUpperCase()}
          </p>
        </div>
      </div>
    </Link>
  );
};
