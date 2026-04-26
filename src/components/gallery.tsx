import { GalleryBlock } from "@/types/content-block";
import { getStrapiImage } from "@/lib/strapi/get-strapi-image";
import Image from "next/image";
import { GalleryClient, LightboxImage } from "./gallery-lightbox";

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

  const fullImages = images.filter(
    (img) => img.caption?.toLowerCase() === "full"
  );
  const gridImages = images.filter(
    (img) => img.caption?.toLowerCase() !== "full"
  );

  const lightboxImages: LightboxImage[] = gridImages.map((img) => ({
    src: getStrapiImage(img.url),
    alt: img.alternativeText ?? "",
    width: img.width,
    height: img.height,
    caption: img.caption,
  }));

  return (
    <>
      {fullImages.map((img) => (
        <div
          key={img.documentId}
          className="flex justify-center w-full my-4"
        >
          <Image
            src={getStrapiImage(img.url)}
            alt={img.alternativeText ?? ""}
            width={img.width}
            height={img.height}
            className="rounded-xl h-auto"
            style={{ maxWidth: "100%" }}
          />
        </div>
      ))}

      {gridImages.length > 0 && (
        <GalleryClient images={lightboxImages} gridClass={gridClass} />
      )}
    </>
  );
};
