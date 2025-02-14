import { CityGallery } from "../../../features/gallery/types/gallery.types";

// Import individual gallery files
import { barcelona } from "./barcelona";
import { nullarbor } from "./nullarbor";
import { vietnam } from "./vietnam";

// Export individual galleries
export { barcelona, nullarbor, vietnam };

// Export cityGalleries map
export const cityGalleries: Record<string, CityGallery> = {
  BARCELONA: barcelona,
  NULLARBOR: nullarbor,
  VIETNAM: vietnam,
};
