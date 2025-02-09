import { GalleryImage } from "../../types/gallery.types";
import { useEffect, useState, useRef } from "react";
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
  const [shouldCenter, setShouldCenter] = useState(true);

  const checkIfShouldCenter = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // If scrollWidth is greater than clientWidth, not all content is visible
    const shouldCenterNew = container.scrollWidth <= container.clientWidth;
    setShouldCenter(shouldCenterNew);
  };

  useEffect(() => {
    setLoadedImages(images);
    // Check after images load
    setTimeout(checkIfShouldCenter, 100);
  }, [images]);

  // Check on resize
  useEffect(() => {
    window.addEventListener("resize", checkIfShouldCenter);
    return () => window.removeEventListener("resize", checkIfShouldCenter);
  }, []);

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
      className={`h-full overflow-x-auto overflow-y-hidden whitespace-nowrap flex ${
        shouldCenter ? "justify-center" : ""
      }`}
      style={{
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        overscrollBehavior: "none",
        justifyContent: shouldCenter ? "center" : "flex-start",
      }}
    >
      <style>
        {`
          .overflow-x-auto::-webkit-scrollbar {
            display: none;
          }

          .image-hover {
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            z-index: 0;
          }

          .image-hover:hover img { /* Target the image inside .image-hover on hover */
            transform: translate(-6px, -6px) scale(1); /* Move only the image */
          } /* Move only the image */

          .image-hover::before {/* Coral box behind image */
            content: '';
            position: absolute;
        
            width: 100%;     /* Same width as image */
            height: 100%;    /* Same height as image */
            z-index: -1;    /* Behind image */
          }

          .image-hover:hover::before { /* Coral color on hover */
            background-color: ${COLORS.dark};
          }

        `}
      </style>
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
