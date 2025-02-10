export const getCloudinaryUrl = (
  publicId: string,
  options?: { lowQuality?: boolean }
) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const transformations = options?.lowQuality
    ? "w_100,e_blur:1000,q_1,f_auto" // Tiny placeholder
    : "q_auto:good,f_auto,w_800"; // Full quality image with good compression
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`;
};
