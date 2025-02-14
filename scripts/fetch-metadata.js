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
      constant: folder.toUpperCase(), // For cities ticker constant (e.g., "NEW YORK")
      key: folder.toUpperCase().replace(/\s+/g, "_"), // For object keys (e.g., "NEW_YORK")
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

async function createGalleryBoilerplate(folder) {
  const galleryDir = "./src/lib/data/galleries";
  const fileName = `${folder.file}.ts`;
  const filePath = path.join(galleryDir, fileName);

  console.log(
    `\nCreating gallery boilerplate for ${folder.display} at ${filePath}`
  );

  try {
    // Create example gallery object
    const gallery = {
      city: folder.display,
      images: [],
    };

    // Create the new file content
    const content = `import { CityGallery } from "../../../features/gallery/types/gallery.types";

export const ${folder.variable}: CityGallery = ${JSON.stringify(
      gallery,
      null,
      2
    )};
`;

    await fs.writeFile(filePath, content, "utf-8");
    console.log(`Successfully created gallery file for ${folder.display}`);
  } catch (error) {
    console.error(`Error creating gallery file for ${folder.display}:`, error);
    throw error;
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

    // Clean up existing gallery files
    await cleanupGalleryFiles();

    // Update cities constant
    await updateCitiesConstant(folders);

    // Create gallery files for each folder
    for (const folder of folders) {
      await createGalleryBoilerplate(folder);
    }

    // Update galleries index
    await updateGalleriesIndex(folders);

    console.log("\nScript completed successfully!");
  } catch (error) {
    console.error("\nScript failed:", error);
    process.exit(1);
  }
}

main();
