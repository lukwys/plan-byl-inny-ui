"use client";

import Lightbox from "yet-another-react-lightbox";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";
import { useState } from "react";
import Image from "next/image";

export type LightboxImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
};

type Props = {
  images: LightboxImage[];
  gridClass: string;
};

const TILE_HEIGHTS = [
  { minWidth: 1280, height: 600 },
  { minWidth: 1024, height: 420 },
  { minWidth: 640, height: 320 },
  { minWidth: 0, height: 260 },
];

const MAX_TILE_WIDTHS: Record<number, number> = { 1: 640, 2: 480, 3: 320 };

const buildSizes = (image: LightboxImage, count: number) => {
  const aspect =
    image.width && image.height ? image.width / image.height : 1.5;
  const maxTileWidth = MAX_TILE_WIDTHS[Math.min(count, 3)];

  return TILE_HEIGHTS.map(({ minWidth, height }) => {
    const rendered = Math.ceil(Math.max(maxTileWidth, height * aspect));
    return minWidth
      ? `(min-width: ${minWidth}px) ${rendered}px`
      : `${rendered}px`;
  }).join(", ");
};

export const GalleryClient = ({ images, gridClass }: Props) => {
  const [index, setIndex] = useState(-1);
  const [lightboxMounted, setLightboxMounted] = useState(false);
  const count = images.length;

  const slides = images.map((img) => ({
    src: img.src,
    alt: img.alt,
    width: img.width,
    height: img.height,
    description: img.caption,
  }));

  return (
    <>
      <div className={`my-6 grid gap-4 ${gridClass}`}>
        {images.map((img, i) => (
          <button
            key={img.src + i}
            type="button"
            onClick={() => { setLightboxMounted(true); setIndex(i); }}
            aria-label={img.caption ? `Otwórz zdjęcie w powiększeniu: ${img.caption}` : "Otwórz zdjęcie w powiększeniu"}
            className={[
              "group relative w-full overflow-hidden rounded-xl cursor-zoom-in",
              "h-[260px] sm:h-[320px] lg:h-[420px] xl:h-[600px]",
              count === 1 ? "mx-auto sm:max-w-[640px]" : "",
            ].join(" ")}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes={buildSizes(img, count)}
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-4 pb-3 pt-10">
              {img.caption && (
                <p className="text-sm text-white/90 leading-snug text-center">{img.caption}</p>
              )}
            </div>
          </button>
        ))}
      </div>

      {lightboxMounted && (
        <Lightbox
          open={index >= 0}
          index={index}
          close={() => setIndex(-1)}
          slides={slides}
          plugins={[Captions]}
          captions={{ descriptionTextAlign: "center" }}
        />
      )}
    </>
  );
};
