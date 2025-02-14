export interface ImageMetadata {
  dateTaken?: string;
  make?: string;
  model?: string;
  gpsLatitude?: string;
  gpsLongitude?: string;
  exposureTime?: string;
  aperture?: string;
  focalLength?: string;
  iso?: string;
  lensModel?: string;
  caption?: string;
}


export interface GalleryImage {
  id: string;
  publicId: string;
  width: number;
  height: number;
  metadata?: ImageMetadata;
}

export interface CityGallery {
  city: string;
  images: GalleryImage[];
}
