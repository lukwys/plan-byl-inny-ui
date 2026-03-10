type GalleryBlock = {
  id: number;
  __component: "content.gallery";
  image_gallery?: GalleryImage[];
};

type GalleryImage = {
  documentId: string;
  url: string;
  alternativeText?: string | null;
  width: number;
  height: number;
  caption?: string;
};

type ParagraphBlock = {
  id: number;
  __component: "content.paragraph-md";
  paragraph: string;
};

export type ContentBlock = ParagraphBlock | GalleryBlock;
