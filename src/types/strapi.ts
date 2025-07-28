export type StrapiResponse<T> = {
    data: T
    meta?: Record<string, any>
  }

  export type StrapiImageFormat = {
    name: string
    hash: string
    ext: string
    mime: string
    path: string | null
    width: number
    height: number
    size: number
    sizeInBytes: number
    url: string
  };
  
  export type StrapiImageFormats = {
    thumbnail?: StrapiImageFormat
    small?: StrapiImageFormat
    medium?: StrapiImageFormat
    large?: StrapiImageFormat
  };
  
  export type StrapiImage = {
    id: number
    documentId: string
    name: string
    alternativeText: string | null
    caption: string | null
    width: number
    height: number
    formats: StrapiImageFormats
    hash: string
    ext: string
    mime: string
    size: number
    url: string
    previewUrl: string | null
    provider: string
    provider_metadata: unknown
    createdAt: string
    updatedAt: string
    publishedAt: string
  }
  