import { CityGallery } from "../../../features/gallery/types/gallery.types";

// Import individual gallery files
import { barcelona } from "./barcelona";
import { paris } from "./paris";

// Export individual galleries
export { barcelona, paris };

// Export cityGalleries map
export const cityGalleries: Record<string, CityGallery> = {
  BARCELONA: barcelona,
  PARIS: paris,
};
