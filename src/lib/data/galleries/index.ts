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
  BARCELONA: { ...barcelona, city: "BARCELONA" },
  LONDON: { ...london, city: "LONDON" },
  MELBOURNE: { ...melbourne, city: "MELBOURNE" },
  NEW_YORK: { ...newyork, city: "NEW_YORK" },
  PARIS: { ...paris, city: "PARIS" },
  TOKYO: { ...tokyo, city: "TOKYO" },
};
