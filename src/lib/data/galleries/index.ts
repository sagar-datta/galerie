import { CityGallery } from "../../../features/gallery/types/gallery.types";

// Import individual gallery files
import { barcelona } from "./barcelona";
import { nullarbor } from "./nullarbor";

// Export individual galleries
export { barcelona, nullarbor };

// Export cityGalleries map
export const cityGalleries: Record<string, CityGallery> = {
  BARCELONA: barcelona,
  NULLARBOR: nullarbor,
};
