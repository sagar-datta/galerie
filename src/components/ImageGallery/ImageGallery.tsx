import { GalleryImage } from "../../types/gallery.types";
import { useCallback, useEffect, useState, useRef } from "react";
import { COLORS } from "../../constants/colors";

function getCloudinaryUrl(publicId: string) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  return `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`;
}

interface ImageGalleryProps {
  city: string;
  images: GalleryImage[];
}

export function ImageGallery({ city, images }: ImageGalleryProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [loadedImages, setLoadedImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    setLoadedImages(images);
  }, [images]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      // If it's horizontal scroll, use it directly
      if (Math.abs(e.deltaX) > 0) {
        container.scrollLeft += e.deltaX;
        return;
      }

      // For vertical scroll, use a consistent multiplier
      container.scrollLeft += e.deltaY * 2.5;
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  // Split images into two rows
  const splitIntoRows = (images: GalleryImage[]): GalleryImage[][] => {
    const rows: GalleryImage[][] = [[], []];
    images.forEach((image, index) => {
      rows[index % 2].push(image);
    });
    return rows;
  };

  const imageRows = splitIntoRows(loadedImages);

  return (
    <div
      ref={scrollContainerRef}
      className="h-full overflow-x-auto overflow-y-hidden whitespace-nowrap"
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        overscrollBehavior: "none",
      }}
    >
      <style>
        {`
          .overflow-x-auto::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      <div className="h-full flex flex-col gap-2">
        {imageRows.map((row, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className="flex gap-8 h-[calc(50%-0.25rem)] px-8"
          >
            {row.map((image, imageIndex) => (
              <div
                key={`${image.id}-${rowIndex}-${imageIndex}`}
                className="relative flex-none aspect-square h-[85%] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden"
                style={{ marginTop: "auto", marginBottom: "auto" }}
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
              </div>
            ))}
            {/* Spacer element to ensure consistent end padding */}
            <div className="flex-none w-8" aria-hidden="true"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
