import { CityGallery } from "../../../features/gallery/types/gallery.types";

// Import individual gallery files
import { barcelona } from "./barcelona";
import { halongbay } from "./ha-long-bay";
import { hanoi } from "./hanoi";
import { hue } from "./hue";
import { sapa } from "./sa-pa";

// Export individual galleries
export { barcelona, halongbay, hanoi, hue, sapa };

// Export cityGalleries map
export const cityGalleries: Record<string, CityGallery> = {
  BARCELONA: barcelona,
  HA_LONG_BAY: halongbay,
  HANOI: hanoi,
  HUE: hue,
  SA_PA: sapa,
};
