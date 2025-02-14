import { CityGallery } from "../../../features/gallery/types/gallery.types";

// Import individual gallery files
import { barcelona } from "./barcelona";
import { halongbay } from "./ha-long-bay";
import { hanoi } from "./hanoi";

// Export individual galleries
export { barcelona, halongbay, hanoi };

// Export cityGalleries map
export const cityGalleries: Record<string, CityGallery> = {
  BARCELONA: barcelona,
  HA_LONG_BAY: halongbay,
  HANOI: hanoi,
};
