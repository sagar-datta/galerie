import { CityGallery } from "../../../features/gallery/types/gallery.types";

// Import individual gallery files
import { barcelona } from "./barcelona";
import { london } from "./london";
import { melbourne } from "./melbourne";
import { newyork } from "./new-york";
import { paris } from "./paris";
import { tokyo } from "./tokyo";

// Export individual galleries
export { barcelona, london, melbourne, newyork, paris, tokyo };

// Export cityGalleries map
export const cityGalleries: Record<string, CityGallery> = {
  BARCELONA: barcelona,
  LONDON: london,
  MELBOURNE: melbourne,
  NEW_YORK: newyork,
  PARIS: paris,
  TOKYO: tokyo,
};
