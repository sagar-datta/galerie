const formatCoordinatePart = (coordinate: string) => {
  // Input format: "41 deg 23' 30.53\" N"
  const regex = /(\d+)\s*deg\s*(\d+)'\s*([\d.]+)"\s*([NSEW])/;
  const match = coordinate.match(regex);
  if (!match) return null;

  const [_, degrees, minutes, seconds, direction] = match;
  // Format to one decimal place for seconds
  const formattedSeconds = Number(seconds).toFixed(1);
  return `${degrees}°${minutes}'${formattedSeconds}"${direction}`;
};

export const formatGpsCoordinates = (latitude: string, longitude: string) => {
  const lat = formatCoordinatePart(latitude);
  const long = formatCoordinatePart(longitude);
  if (!lat || !long) return "Unknown location";
  return `${lat} ${long}`;
};

export const parseGpsCoordinate = (coordinate: string) => {
  // Input format: "41 deg 23' 30.53\" N"
  const regex = /(\d+)\s*deg\s*(\d+)'\s*([\d.]+)"\s*([NSEW])/;
  const match = coordinate.match(regex);
  if (!match) return null;

  const [_, degrees, minutes, seconds, direction] = match;
  const decimal =
    Number(degrees) + Number(minutes) / 60 + Number(seconds) / 3600;
  return direction === "S" || direction === "W" ? -decimal : decimal;
};
