import fs from "fs/promises";
import path from "path";

/**
 * Clean up existing gallery files except index.ts
 */
export async function cleanupGalleryFiles() {
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

/**
 * Update the cities constant file
 * @param {Array<object>} folders - Array of formatted folder objects
 */
export async function updateCitiesConstant(folders) {
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

/**
 * Create individual gallery files for each city
 * @param {Array<object>} folders - Array of formatted folder objects
 * @param {object} cityImageData - Object containing image data for each city
 */
export async function createGalleryFiles(folders, cityImageData) {
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

/**
 * Update the galleries index file
 * @param {Array<object>} folders - Array of formatted folder objects
 */
export async function updateGalleriesIndex(folders) {
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