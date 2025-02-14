export interface CloudinaryOptions {
  lowQuality?: boolean;
  mediumQuality?: boolean;
  width?: number;
  priority?: boolean;
}

export interface CloudinaryExifData {
  make?: string;
  model?: string;
  exposure_time?: string;
  aperture?: string;
  focal_length?: string;
  iso?: number;
  gps?: {
    latitude: number;
    longitude: number;
  };
  created_at?: string;
}

export interface CloudinaryImageInfo {
  public_id: string;
  format: string;
  version: string;
  resource_type: string;
  type: string;
  created_at: string;
  bytes: number;
  width: number;
  height: number;
  exif?: CloudinaryExifData;
}
