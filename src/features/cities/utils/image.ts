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
    // Preload exact same quality version that will be used in modal
    const fullQualityImg = new Image();
    fullQualityImg.src = getCloudinaryUrl(encodeURIComponent(image.publicId), {
      width: 1600,
      priority: true
    });

    // Preload low quality version
    const lowQualityImg = new Image();
    lowQualityImg.src = getCloudinaryUrl(encodeURIComponent(image.publicId), {
      lowQuality: true,
    });
  });
};
