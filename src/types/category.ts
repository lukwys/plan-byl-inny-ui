export type CategoryModel = {
  documentId: string;
  name: string;
  slug: string;
  image?: {
    url: string;
    alternativeText?: string | null;
  } | null;
};
