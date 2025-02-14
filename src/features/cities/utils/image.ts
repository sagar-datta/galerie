import { cityGalleries } from "../../../lib/data";
import { getCloudinaryUrl } from "../../../lib/cloudinary";
import { GalleryImage } from "../../gallery/types/gallery.types";

export const preloadImagesForCity = (cityName: string) => {
  const cityKey = Object.keys(cityGalleries).find(
    (key) => key.toLowerCase() === cityName.toLowerCase()
  );

  if (!cityKey) return;

  const gallery = cityGalleries[cityKey];
  gallery.images.forEach((image: GalleryImage) => {
    // Preload medium quality version for gallery thumbnails
    const mediumQualityImg = new Image();
    mediumQualityImg.src = getCloudinaryUrl(encodeURIComponent(image.publicId), {
      mediumQuality: true,
      priority: true
    });
  });
};
