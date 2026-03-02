import { STRAPI_URL } from "@/config/strapi";
import { GalleryBlock } from "@/types/post";
import Image from "next/image";

type GalleryProps = {
  block: GalleryBlock;
};

export const Gallery = ({ block }: GalleryProps) => {
  const images = block.image_gallery ?? [];
  const count = images.length;

  if (count === 0) return null;

  const gridClass =
    count === 1
      ? "grid-cols-1"
      : count === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : "grid-cols-1 sm:grid-cols-3";

  return (
    <div key={block.id} className={`my-6 grid gap-4 ${gridClass}`}>
      {images.map((img) => {
        const isFull = img.caption?.toLowerCase() === "full";

        if (isFull) {
          return (
            <div
              key={img.documentId}
              className="flex justify-center w-full my-4"
            >
              <Image
                src={`${STRAPI_URL}${img.url}`}
                alt={img.alternativeText ?? ""}
                width={img.width}
                height={img.height}
                className="rounded-xl h-auto"
                style={{ maxWidth: "100%" }}
              />
            </div>
          );
        }

        return (
          <div
            key={img.documentId}
            className={[
              "relative w-full overflow-hidden rounded-xl",
              "h-[260px] sm:h-[320px] lg:h-[420px] xl:h-[600px]",
              count === 1 ? "mx-auto sm:max-w-[640px]" : "",
            ].join(" ")}
          >
            <Image
              src={`${STRAPI_URL}${img.url}`}
              alt={img.alternativeText ?? ""}
              fill
              sizes={
                count === 1
                  ? "(min-width: 640px) 640px, 100vw"
                  : count === 2
                    ? "(min-width: 640px) 50vw, 100vw"
                    : "(min-width: 640px) 33vw, 100vw"
              }
              className="object-cover"
            />
          </div>
        );
      })}
    </div>
  );
};
