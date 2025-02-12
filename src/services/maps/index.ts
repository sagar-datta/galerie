import { parseGpsCoordinate } from "../../utils/geo/coordinates";

export const getGoogleMapsUrl = (latitude: string, longitude: string) => {
  const lat = parseGpsCoordinate(latitude);
  const lng = parseGpsCoordinate(longitude);
  if (!lat || !lng) return null;
  return `https://www.google.com/maps?q=${lat},${lng}`;
};
