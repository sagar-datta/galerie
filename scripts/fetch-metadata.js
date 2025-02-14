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

async function fetchImageMetadata(publicId) {
  console.log(`\nFetching metadata for image: ${publicId}`);

  try {
    console.log("Making Cloudinary API request...");
    const result = await cloudinary.api.resource(publicId, {
      image_metadata: true,
      exif: true,
    });

    console.log("Received response from Cloudinary");
    const metadata = result.image_metadata || result.exif || {};
    console.log("Raw metadata:", JSON.stringify(metadata, null, 2));

    return {
      dateTaken: metadata.DateTimeOriginal || metadata.CreateDate,
      make: metadata.Make,
      model: metadata.Model,
      gpsLatitude: metadata.GPSLatitude,
      gpsLongitude: metadata.GPSLongitude,
      exposureTime: metadata.ExposureTime,
      aperture: metadata.FNumber,
      focalLength: metadata.FocalLengthIn35mmFormat,
      iso: metadata.ISO?.toString(),
      lensModel: metadata.LensModel,
    };
  } catch (error) {
    console.error("Error fetching metadata:", error);
    if (error.error) {
      console.error("Cloudinary error details:", error.error);
    }
    return null;
  }
}

async function updateGalleryFile(galleryPath) {
  console.log(`\nUpdating gallery file: ${galleryPath}`);

  try {
    // Create example gallery object with our test image
    const gallery = {
      city: "Barcelona",
      images: [
        {
          id: "barcelona_test_image",
          publicId: "sxcpt2godvbkdy7jywqt",
          caption: "Test Image",
          width: 3024,
          height: 4032,
        },
      ],
    };

    console.log("Gallery object created, fetching metadata for images...");

    // Fetch metadata for each image
    for (const image of gallery.images) {
      console.log(`Processing image: ${image.publicId}`);
      const metadata = await fetchImageMetadata(image.publicId);
      if (metadata) {
        image.metadata = metadata;
        console.log("Added metadata to image:", metadata);
      } else {
        console.log("No metadata retrieved for image");
      }
    }

    // Create the new file content
    const newContent = `import { CityGallery } from "../../../features/gallery/types/gallery.types";

export const ${path.basename(
      galleryPath,
      ".ts"
    )}: CityGallery = ${JSON.stringify(gallery, null, 2)};
`;

    console.log("Writing updated content to file...");
    await fs.writeFile(galleryPath, newContent, "utf-8");
    console.log(`Successfully updated ${galleryPath}`);
  } catch (error) {
    console.error("Error updating gallery file:", error);
  }
}

// Update Barcelona gallery
console.log("\nStarting gallery update process...");
const barcelonaPath = "./src/lib/data/galleries/barcelona.ts";
updateGalleryFile(barcelonaPath)
  .then(() => console.log("\nScript completed successfully!"))
  .catch((error) => console.error("\nScript failed:", error));
