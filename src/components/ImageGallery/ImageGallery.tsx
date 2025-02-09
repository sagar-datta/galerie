import { GalleryImage } from "../../types/gallery.types";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import "./ImageGallery.css";

const getCloudinaryUrl = (publicId: string) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  return `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`;
};

interface ImageGalleryProps {
  city: string;
  images: GalleryImage[];
}

export function ImageGallery({ city, images }: ImageGalleryProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [shouldCenter, setShouldCenter] = useState(true);

  const checkIfShouldCenter = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // If scrollWidth is greater than clientWidth, not all content is visible
    const shouldCenterNew = container.scrollWidth <= container.clientWidth;
    setShouldCenter(shouldCenterNew);
  }, []);

  // Use ResizeObserver to detect when images load and container size changes
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      checkIfShouldCenter();
    });

    const container = scrollContainerRef.current;
    if (container) {
      observer.observe(container);
    }

    return () => {
      if (container) {
        observer.unobserve(container);
      }
      observer.disconnect();
    };
  }, [checkIfShouldCenter]);

  // Check on resize
  useEffect(() => {
    window.addEventListener("resize", checkIfShouldCenter);
    return () => window.removeEventListener("resize", checkIfShouldCenter);
  }, [checkIfShouldCenter]);

  const handleWheel = useCallback((e: WheelEvent) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    e.preventDefault();

    // If it's horizontal scroll, use it directly
    if (Math.abs(e.deltaX) > 0) {
      container.scrollLeft += e.deltaX;
      return;
    }

    // For vertical scroll, use a consistent multiplier
    container.scrollLeft += e.deltaY * 2.5;
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  // Split images into two rows - memoized to prevent unnecessary recalculations
  const imageRows = useMemo(() => {
    const rows: GalleryImage[][] = [[], []];
    images.forEach((image, index) => {
      rows[index % 2].push(image);
    });
    return rows;
  }, [images]);

  return (
    <div
      ref={scrollContainerRef}
      className={`h-full overflow-x-auto overflow-y-hidden whitespace-nowrap flex ${
        shouldCenter ? "justify-center" : ""
      }`}
      style={{
        justifyContent: shouldCenter ? "center" : "flex-start",
      }}
    >
      <div className="h-full flex flex-col gap-2">
        {imageRows.map((row, rowIndex) => (
          <div
            key={`row-${rowIndex}`}
            className="flex gap-8 h-[calc(50%-0.25rem)] px-10"
          >
            {row.map((image, imageIndex) => (
              <div
                key={`${image.id}-${rowIndex}-${imageIndex}`}
                className="relative flex-none aspect-square h-[85%] image-hover"
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
          </div>
        ))}
      </div>
    </div>
  );
}
