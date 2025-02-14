import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";
import { configureCloudinary } from "./utils/cloudinary.js";
import { formatCityNames } from "./utils/formatting.js";
import { loadExistingMetadata, extractImageMetadata, parseDateTime, sortImagesByDate } from "./utils/metadata.js";
import { cleanupGalleryFiles, updateCitiesConstant, createGalleryFiles, updateGalleriesIndex } from "./utils/files.js";
import { retry } from "./utils/retry.js";

dotenv.config();

console.log("Starting metadata fetch script...");

// Configure Cloudinary
configureCloudinary();

async function getFolders() {
  try {
    console.log("\nFetching root folders from Cloudinary...");
    const result = await retry(async () => await cloudinary.api.root_folders());
    const formattedFolders = formatCityNames(
      result.folders.map((folder) => folder.name)
    );
    console.log(
      "Found folders:",
      formattedFolders.map((f) => f.display)
    );
    return formattedFolders;
  } catch (error) {
    console.error("Error fetching folders:", error);
    // For testing purposes, return some default folders if Cloudinary fails
    console.log("Using default folders for testing...");
    return formatCityNames([
      "Barcelona",
      "London",
      "Melbourne",
      "New York",
      "Paris",
      "Tokyo",
    ]);
  }
}

async function getImagesInFolder(folderName, existingMetadata = new Map()) {
  console.log(`\nFetching images for ${folderName}...`);
  let images = [];
  let nextCursor = null;

  do {
    try {
      // First, get a list of all resources
      const result = await retry(
        async () =>
          await cloudinary.api.resources({
            type: "upload",
            max_results: 500,
            next_cursor: nextCursor
          })
      );

      const resources = (result.resources || []).filter(
        (resource) => resource.asset_folder === folderName
      );

      console.log(`Found ${resources.length} images for ${folderName}`);

      // Process each resource
      for (const resource of resources) {
        const existingData = existingMetadata.get(resource.public_id);

        // Only datetime and model are required fields
        const requiredMetadata = [
          'dateTaken',
          'model'
        ];

        // Check if all required fields exist and are not null/undefined
        const hasValidMetadata = existingData && requiredMetadata.every(field => 
          existingData[field] !== undefined && existingData[field] !== null
        );

        if (hasValidMetadata) {
          // Use existing metadata if it contains all required fields
          console.log(`Using existing metadata for ${resource.public_id}`);
          images.push({
            ...resource,
            metadata: existingData
          });
        } else {
          // Fetch detailed metadata if any required field is missing
          console.log(`Fetching new metadata for ${resource.public_id}`);
          try {
            const detailedResource = await retry(
              async () =>
                await cloudinary.api.resource(resource.public_id, {
                  exif: true,
                  colors: true,
                  image_metadata: true,
                  coordinates: true,
                  context: true,
                })
            );

            images.push({
              ...resource,
              metadata: extractImageMetadata(detailedResource)
            });
          } catch (error) {
            console.error(
              `Error fetching details for ${resource.public_id}:`,
              error
            );
            // Add the resource without metadata rather than skipping it
            images.push(resource);
          }
        }
      }

      nextCursor = result.next_cursor;
    } catch (error) {
      console.error(`Error fetching images:`, error);
      break;
    }
  } while (nextCursor);

  return images;
}

async function buildCityImageData(folders) {
  const cityImageData = {};

  for (const folder of folders) {
    // Load existing metadata for this city
    const existingMetadata = await loadExistingMetadata(folder);
    console.log(`Loaded ${existingMetadata.size} existing metadata entries for ${folder.display}`);

    const images = await getImagesInFolder(folder.original, existingMetadata);
    // Sort images by date taken before processing
    const sortedImages = sortImagesByDate(images);
    cityImageData[folder.key] = sortedImages
      .filter((image) => image.asset_folder === folder.original)
      .map((resource) => ({
        id: resource.asset_id,
        publicId: resource.public_id,
        width: resource.width,
        height: resource.height,
        metadata: resource.metadata || extractImageMetadata(resource),
      }));
  }

  return cityImageData;
}

// Main execution
async function main() {
  try {
    // Get folders from Cloudinary
    const folders = await getFolders();

    // Get image data for all cities
    console.log("\nFetching image data for all cities...");
    const cityImageData = await buildCityImageData(folders);
    console.log("Successfully fetched all city image data");

    // Clean up existing gallery files
    await cleanupGalleryFiles();

    // Update cities constant
    await updateCitiesConstant(folders);

    // Create gallery files with image data
    await createGalleryFiles(folders, cityImageData);

    // Update galleries index
    await updateGalleriesIndex(folders);

    console.log("\nScript completed successfully!");
  } catch (error) {
    console.error("\nScript failed:", error);
    process.exit(1);
  }
}

main();
