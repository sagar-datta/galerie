import { CloudinaryOptions } from "./types";

export const getCloudinaryUrl = (
  publicId: string,
  options?: CloudinaryOptions & { includeExif?: boolean }
) => {
  // Access environment variables using import.meta.env
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  if (!cloudName) {
    console.error("Cloudinary cloud name is not defined");
    return "";
  }

  // Define transformation based on quality level
  let transformations = "";
  if (options?.lowQuality) {
    // Tiny placeholder - extremely small and blurred
    transformations = "w_20,e_blur:1000,q_1,f_auto";
  } else if (options?.mediumQuality) {
    // Medium quality preview - good balance of quality and speed
    transformations = `w_400,q_auto:eco,f_auto,c_scale${
      options?.priority ? ",fl_progressive:steep" : ""
    }`;
  } else {
    // Full quality image with responsive width
    const width = options?.width || 800;
    const qualityLevel = width > 1000 ? "best" : "good";
    transformations = `w_${width},q_auto:${qualityLevel},f_auto,c_scale,dpr_auto${
      options?.priority ? ",fl_progressive:steep" : ""
    }`;
  }

  // Add EXIF data retrieval if requested
  if (options?.includeExif) {
    transformations = `${transformations},fl_getinfo`;
  }

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`;
};
