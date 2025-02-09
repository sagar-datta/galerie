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
      // The 2.5 multiplier makes vertical scrolling feel more natural
      container.scrollLeft += e.deltaY * 2.5;
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <div
      ref={scrollContainerRef}
      className="h-full overflow-x-auto overflow-y-hidden whitespace-nowrap"
      style={{
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // IE and Edge
        overscrollBehavior: "none", // Prevent bouncing
      }}
    >
      {/* Hide scrollbar for Chrome, Safari and Opera */}
      <style>
        {`
          .overflow-x-auto::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      <div className="flex gap-4 px-8 h-full items-center">
        {loadedImages.map((image, index) => (
          <div
            key={`${image.id}-${index}`}
            className="relative flex-none w-[400px] aspect-square rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
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
    </div>
  );
}
