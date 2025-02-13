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
    // Preload full quality version
    const fullQualityImg = new Image();
    fullQualityImg.src = getCloudinaryUrl(image.publicId);

    // Preload low quality version
    const lowQualityImg = new Image();
    lowQualityImg.src = getCloudinaryUrl(image.publicId, { lowQuality: true });
  });
};
