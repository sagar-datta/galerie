import { CityGallery } from "../../../features/gallery/types/gallery.types";

// Import individual gallery files
import { barcelona } from "./barcelona";
import { halongbay } from "./ha-long-bay";
import { hanoi } from "./hanoi";
import { hoian } from "./hoi-an";
import { hue } from "./hue";
import { nullarbor } from "./nullarbor";
import { sapa } from "./sa-pa";

// Export individual galleries
export { barcelona, halongbay, hanoi, hoian, hue, nullarbor, sapa };

// Export cityGalleries map
export const cityGalleries: Record<string, CityGallery> = {
  BARCELONA: barcelona,
  HA_LONG_BAY: halongbay,
  HANOI: hanoi,
  HOI_AN: hoian,
  HUE: hue,
  NULLARBOR: nullarbor,
  SA_PA: sapa,
};
