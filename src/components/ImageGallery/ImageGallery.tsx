import { GalleryImage } from "../../types/gallery.types";
import { useCallback, useEffect, useState } from "react";
import { COLORS } from "../../constants/colors";

// Helper to generate Cloudinary URL
function getCloudinaryUrl(publicId: string) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  return `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`;
}

interface ImageGalleryProps {
  city: string;
  images: GalleryImage[];
}

export function ImageGallery({ city, images }: ImageGalleryProps) {
  const [loadedImages, setLoadedImages] = useState<GalleryImage[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const imagesPerPage = 6;

  // Reset loaded images when city changes
  useEffect(() => {
    setLoadedImages([]);
    setHasMore(true);
    loadMoreImages();
  }, [city]);

  const loadMoreImages = useCallback(() => {
    const currentLength = loadedImages.length;
    const remainingImages = images.length - currentLength;

    if (remainingImages <= 0) {
      setHasMore(false);
      return;
    }

    const newImages = images.slice(
      currentLength,
      currentLength + Math.min(imagesPerPage, remainingImages)
    );

    setLoadedImages((prev) => [...prev, ...newImages]);
    setHasMore(currentLength + imagesPerPage < images.length);
  }, [images, loadedImages.length]);

  // Debug log
  console.log(
    "Loading images:",
    loadedImages.map((img) => getCloudinaryUrl(img.publicId))
  );

  return (
    <div className="w-full px-4 py-8">
      <h2
        className="text-4xl font-bold mb-8 text-center"
        style={{ color: COLORS.dark }}
      >
        {city} Gallery
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loadedImages.map((image, index) => (
          <div
            key={`${image.id}-${index}`}
            className="relative aspect-square overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={getCloudinaryUrl(image.publicId)}
              alt={image.caption || `Photo from ${city}`}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                console.error("Image load error for:", image.publicId);
                const imgElement = e.target as HTMLImageElement;
                console.log("Failed URL:", imgElement.src);
              }}
            />
            {image.caption && (
              <div
                className="absolute bottom-0 left-0 right-0 p-4 text-white text-sm"
                style={{
                  background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
                }}
              >
                {image.caption}
              </div>
            )}
          </div>
        ))}
      </div>
      {hasMore && (
        <button
          className="mt-8 px-6 py-3 mx-auto block text-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          style={{ backgroundColor: COLORS.coral }}
          onClick={loadMoreImages}
        >
          Load More Images
        </button>
      )}
    </div>
  );
}
