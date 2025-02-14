import { CityGallery } from "../../../features/gallery/types/gallery.types";

// Import individual gallery files
import { andalusia } from "./andalusia";
import { barcelona } from "./barcelona";
import { nullarbor } from "./nullarbor";
import { vietnam } from "./vietnam";

// Export individual galleries
export { andalusia, barcelona, nullarbor, vietnam };

// Export cityGalleries map
export const cityGalleries: Record<string, CityGallery> = {
  ANDALUSIA: andalusia,
  BARCELONA: barcelona,
  NULLARBOR: nullarbor,
  VIETNAM: vietnam,
};
