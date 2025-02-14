export interface ImageMetadata {
  dateTaken?: string;
  make?: string;
  model?: string;
  GPSLatitude?: string;
  GPSLongitude?: string;
  exposure_time?: string;
  aperture?: string;
  focal_length?: string;
  iso?: string;
}

export interface GalleryImage {
  id: string;
  publicId: string;
  caption?: string;
  width: number;
  height: number;
  metadata?: ImageMetadata;
}

export interface CityGallery {
  city: string;
  images: GalleryImage[];
}
