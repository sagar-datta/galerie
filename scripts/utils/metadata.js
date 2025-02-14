import fs from "fs/promises";
import path from "path";

/**
 * Load existing metadata for a city from its gallery file
 * @param {object} folder - Folder object with formatting information
 * @returns {Map<string, object>} Map of public_id to metadata
 */
export async function loadExistingMetadata(folder) {
  const galleryDir = "./src/lib/data/galleries";
  const filePath = path.join(galleryDir, `${folder.file}.ts`);

  try {
    const content = await fs.readFile(filePath, 'utf-8');
    // Extract the images array from the file content using regex
    const match = content.match(/images:\s*(\[[\s\S]*?\])/);
    if (match) {
      const imagesJson = match[1];
      const images = JSON.parse(imagesJson);
      // Create a map of public_id to metadata
      return new Map(images.map(img => [img.publicId, img.metadata]));
    }
  } catch (error) {
    // File doesn't exist or can't be parsed, return empty map
    return new Map();
  }
  return new Map();
}

/**
 * Extract relevant metadata from a Cloudinary resource
 * @param {object} resource - Cloudinary resource object
 * @returns {object} Extracted metadata
 */
export function extractImageMetadata(resource) {
  const metadata = resource.image_metadata || {};
  const context = resource.context || {};
  const custom = context.custom || {};

  return {
    dateTaken: metadata.DateTimeOriginal,
    model: metadata.Model,
    gpsLatitude: metadata.GPSLatitude,
    gpsLongitude: metadata.GPSLongitude,
    exposureTime: metadata.ExposureTime,
    aperture: metadata.FNumber,
    focalLength: metadata.FocalLengthIn35mmFormat,
    iso: metadata.ISO,
    lensModel: metadata.LensModel,
    caption: custom.caption || metadata.caption
  };
}

/**
 * Parse date string from image metadata
 * @param {string} dateTimeStr - Date string in format "YYYY:MM:DD HH:mm:ss"
 * @returns {Date} Parsed date object
 */
export function parseDateTime(dateTimeStr) {
  if (!dateTimeStr) return new Date(0); // Return earliest possible date if no date provided
  
  // Input format from Cloudinary: "YYYY:MM:DD HH:mm:ss"
  const [date, time] = dateTimeStr.split(" ");
  const [year, month, day] = date.split(":");
  
  // Create a date object (convert to YYYY-MM-DD format for Date constructor)
  return new Date(`${year}-${month}-${day}T${time}`);
}

/**
 * Sort images by their date taken
 * @param {Array<object>} images - Array of image objects with metadata
 * @returns {Array<object>} Sorted array of images
 */
export function sortImagesByDate(images) {
  return images.sort((a, b) => {
    return parseDateTime(a.metadata?.dateTaken) - parseDateTime(b.metadata?.dateTaken);
  });
}