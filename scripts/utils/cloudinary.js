import { v2 as cloudinary } from "cloudinary";

/**
 * Configure Cloudinary with environment variables and return the configured instance
 * @returns {object} Configured Cloudinary instance
 */
export function configureCloudinary() {
  const config = {
    cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.VITE_CLOUDINARY_API_KEY,
    api_secret: process.env.VITE_CLOUDINARY_API_SECRET,
  };

  console.log("Using Cloudinary config:", {
    cloud_name: config.cloud_name,
    api_key: config.api_key ? "present" : "missing",
    api_secret: config.api_secret ? "present" : "missing",
  });

  cloudinary.config(config);
  return cloudinary;
}

// Export configured cloudinary instance for direct use
export { cloudinary };