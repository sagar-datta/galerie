import { barcelona } from "./barcelona";
import { paris } from "./paris";
import { CityGallery } from "../../../features/gallery/types/gallery.types";

export const cityGalleries: Record<string, CityGallery> = {
  Barcelona: barcelona,
  Paris: paris,
};

// Export individual cities for direct access if needed
export { barcelona, paris };
