export interface GalleryImage {
  id: string;
  publicId: string;
  caption?: string;
  width: number;
  height: number;
}

export interface CityGallery {
  city: string;
  images: GalleryImage[];
}
