import { parseGpsCoordinate } from "../../features/cities/utils/coordinates";

export const getGoogleMapsUrl = (
  latitude: string,
  longitude: string
): string | undefined => {
  const lat = parseGpsCoordinate(latitude);
  const lng = parseGpsCoordinate(longitude);
  if (!lat || !lng) return undefined;
  return `https://www.google.com/maps?q=${lat},${lng}`;
};
