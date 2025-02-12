export interface CloudinaryOptions {
  lowQuality?: boolean;
  mediumQuality?: boolean;
  width?: number;
}

export const getCloudinaryUrl = (
  publicId: string,
  options?: CloudinaryOptions
) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  // Define transformation based on quality level
  let transformations = "";
  if (options?.lowQuality) {
    // Tiny placeholder - extremely small and blurred
    transformations = "w_50,e_blur:1000,q_1,f_auto";
  } else if (options?.mediumQuality) {
    // Medium quality preview - good balance of quality and speed
    transformations = "w_400,q_auto:eco,f_auto,c_scale";
  } else {
    // Full quality image with responsive width
    const width = options?.width || 800;
    transformations = `w_${width},q_auto:good,f_auto,c_scale,dpr_auto`;
  }

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`;
};

export const formatDateTime = (dateTimeStr: string) => {
  // Input format: "2024:12:27 13:44:49"
  const [date, time] = dateTimeStr.split(" ");
  const [year, month, day] = date.split(":");

  // Create a date object
  const dateObj = new Date(`${year}-${month}-${day}T${time}`);

  // Format the date in a more readable way
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Format the time in 12-hour format
  const formattedTime = dateObj.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  return `${formattedDate} at ${formattedTime}`;
};

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

export const getGoogleMapsUrl = (latitude: string, longitude: string) => {
  const lat = parseGpsCoordinate(latitude);
  const lng = parseGpsCoordinate(longitude);
  if (!lat || !lng) return null;
  return `https://www.google.com/maps?q=${lat},${lng}`;
};
