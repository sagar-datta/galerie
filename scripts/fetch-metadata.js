import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

console.log("Starting metadata fetch script...");

// Configure Cloudinary
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

// Retry utility function
async function retry(fn, retries = 3, delay = 2000) {
  let lastError;

  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      console.log(`Attempt ${i + 1} failed, retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

function formatCityNames(folders) {
  return folders.map((folder) => {
    // Convert to title case format for display
    const titleCase = folder
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

    return {
      display: titleCase, // For display (e.g., "New York")
      file: titleCase.toLowerCase().replace(/\s+/g, "-"), // For filenames - lowercase with hyphens (e.g., "new-york")
      variable: titleCase.toLowerCase().replace(/\s+/g, ""), // For variable names (e.g., "newyork")
      constant: folder.toUpperCase().replace(/\s+/g, "_"), // For cities ticker constant (e.g., "NEW_YORK")
      key: folder.toUpperCase().replace(/\s+/g, "_"), // For object keys (e.g., "NEW_YORK")
      original: folder, // Keep original folder name for Cloudinary queries
    };
  });
}

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

function extractImageMetadata(resource) {
  const metadata = resource.image_metadata || {};
  const context = resource.context || {};
  const custom = context.custom || {};

  return {
    dateTaken: metadata.DateTimeOriginal,
    make: metadata.Make,
    model: metadata.Model,
    gpsLatitude: metadata.GPSLatitude,
    gpsLongitude: metadata.GPSLongitude,
    exposureTime: metadata.ExposureTime,
    aperture: metadata.FNumber,
    focalLength: metadata.FocalLengthIn35mmFormat,
    iso: metadata.ISO,
    lensModel: metadata.LensModel,
    caption: custom.caption || metadata.caption
    ,
   
  };
}

async function loadExistingMetadata(folder) {
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

        const hasValidMetadata = existingData && (
          existingData.dateTaken ||
          existingData.make ||
          existingData.model ||
          existingData.gpsLatitude ||
          existingData.gpsLongitude
        );

        if (hasValidMetadata) {
          // Use existing metadata if it contains essential EXIF data
          console.log(`Using existing metadata for ${resource.public_id}`);
          images.push({
            ...resource,
            metadata: existingData
          });
        } else {
          // Fetch detailed metadata only for new images
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

            // Log all metadata to see available fields
            console.log('Full metadata for', resource.public_id, ':');
            console.log('EXIF:', JSON.stringify(detailedResource.exif, null, 2));
            console.log('Image Metadata:', JSON.stringify(detailedResource.image_metadata, null, 2));
            console.log('Context:', JSON.stringify(detailedResource.context, null, 2));

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
    cityImageData[folder.key] = images
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

async function cleanupGalleryFiles() {
  const galleryDir = "./src/lib/data/galleries";
  console.log("\nCleaning up existing gallery files...");

  try {
    const files = await fs.readdir(galleryDir);
    for (const file of files) {
      if (file !== "index.ts" && file.endsWith(".ts")) {
        await fs.unlink(path.join(galleryDir, file));
        console.log(`Deleted ${file}`);
      }
    }
    console.log("Cleanup completed");
  } catch (error) {
    console.error("Error during cleanup:", error);
    throw error;
  }
}

async function updateCitiesConstant(folders) {
  const citiesPath = "./src/features/cities/constants/ticker.ts";
  console.log(`\nUpdating cities constant at ${citiesPath}`);

  try {
    // Create new content for ticker.ts
    const content = `export const CITIES = ${JSON.stringify(
      folders.map((f) => f.constant),
      null,
      2
    )};

export const TICKER_CONFIG = {
  MIN_ROW_HEIGHT: 120,
  ROW_MARGIN: 32,
  DUPLICATE_COUNT: 200,
  SAFETY_BUFFER: 20,
  BOTTOM_MARGIN: 80,
} as const;
`;

    await fs.writeFile(citiesPath, content, "utf-8");
    console.log("Successfully updated cities constant");
  } catch (error) {
    console.error("Error updating cities constant:", error);
    throw error;
  }
}

async function createGalleryFiles(folders, cityImageData) {
  const galleryDir = "./src/lib/data/galleries";

  for (const folder of folders) {
    const fileName = `${folder.file}.ts`;
    const filePath = path.join(galleryDir, fileName);

    console.log(`\nCreating gallery file for ${folder.display} at ${filePath}`);

    try {
      const images = cityImageData[folder.key] || [];

      // Create gallery object with proper typing
      const content = `import { CityGallery } from "../../../features/gallery/types/gallery.types";

export const ${folder.variable}: CityGallery = {
  city: "${folder.display}",
  images: ${JSON.stringify(images, null, 2)}
};
`;

      await fs.writeFile(filePath, content, "utf-8");
      console.log(`Successfully created gallery file for ${folder.display}`);
    } catch (error) {
      console.error(
        `Error creating gallery file for ${folder.display}:`,
        error
      );
      throw error;
    }
  }
}

async function updateGalleriesIndex(folders) {
  const indexPath = "./src/lib/data/galleries/index.ts";
  console.log(`\nUpdating galleries index at ${indexPath}`);

  try {
    // Create import statements
    const imports = folders
      .map((folder) => `import { ${folder.variable} } from "./${folder.file}";`)
      .join("\n");

    // Create exports object with consistent formatting
    const content = `import { CityGallery } from "../../../features/gallery/types/gallery.types";

// Import individual gallery files
${imports}

// Export individual galleries
export { ${folders.map((f) => f.variable).join(", ")} };

// Export cityGalleries map
export const cityGalleries: Record<string, CityGallery> = {
${folders.map((f) => `  ${f.key}: ${f.variable},`).join("\n")}
};
`;

    await fs.writeFile(indexPath, content, "utf-8");
    console.log("Successfully updated galleries index");
  } catch (error) {
    console.error("Error updating galleries index:", error);
    throw error;
  }
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
