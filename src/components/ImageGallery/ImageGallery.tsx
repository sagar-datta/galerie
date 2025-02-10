import { GalleryImage } from "../../types/gallery.types";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { ImageModal } from "./ImageModal";
import { getCloudinaryUrl } from "./utils";
import "./ImageGallery.css";

// Move wheel handler outside component since it doesn't use any component state
const createWheelHandler =
  (container: HTMLDivElement | null) => (e: WheelEvent) => {
    if (!container) return;

    e.preventDefault();

    if (Math.abs(e.deltaX) > 0) {
      container.scrollLeft += e.deltaX;
      return;
    }

    container.scrollLeft += e.deltaY * 2.5;
  };

// Memoize row creation function
const createImageRows = (images: GalleryImage[]) => {
  const rows: GalleryImage[][] = [[], []];
  images.forEach((image, index) => {
    rows[index % 2].push(image);
  });
  return rows;
};

interface ImageGalleryProps {
  city: string;
  images: GalleryImage[];
}

export function ImageGallery({ city, images }: ImageGalleryProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [shouldCenter, setShouldCenter] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const handleImageClick = useCallback((image: GalleryImage) => {
    setSelectedImage(image);
  }, []);

  const checkIfShouldCenter = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const shouldCenterNew = container.scrollWidth <= container.clientWidth;
    setShouldCenter(shouldCenterNew);
  }, []);

  // Preload first 4 images
  useEffect(() => {
    const preloadImages = images.slice(0, 4);
    const links: HTMLLinkElement[] = [];

    preloadImages.forEach((image) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = getCloudinaryUrl(image.publicId);
      document.head.appendChild(link);
      links.push(link);
    });

    return () => {
      links.forEach((link) => document.head.removeChild(link));
    };
  }, [images]);

  useEffect(() => {
    const observer = new ResizeObserver(checkIfShouldCenter);
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

  useEffect(() => {
    window.addEventListener("resize", checkIfShouldCenter);
    return () => window.removeEventListener("resize", checkIfShouldCenter);
  }, [checkIfShouldCenter]);

  // Create and use wheel handler directly in useEffect
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const wheelHandler = createWheelHandler(container);
    container.addEventListener("wheel", wheelHandler, { passive: false });
    return () => container.removeEventListener("wheel", wheelHandler);
  }, []); // Empty deps since we get fresh ref value in handler creation

  const handleImageLoad = useCallback((imageId: string) => {
    setLoadedImages((prev) => new Set(prev).add(imageId));
  }, []);

  // Memoize image rows calculation with proper dependency
  const imageRows = useMemo(() => createImageRows(images), [images]);

  return (
    <div className="relative h-full">
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
                  style={{
                    marginTop: "auto",
                    marginBottom: "auto",
                    background: `url(${getCloudinaryUrl(image.publicId, {
                      lowQuality: true,
                    })})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => handleImageClick(image)}
                >
                  <img
                    src={getCloudinaryUrl(image.publicId)}
                    alt={image.caption || `Photo from ${city}`}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${
                      loadedImages.has(image.id) ? "opacity-100" : "opacity-0"
                    }`}
                    loading={
                      rowIndex === 0 || imageIndex < 2 ? "eager" : "lazy"
                    }
                    onLoad={() => handleImageLoad(image.id)}
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
      <ImageModal
        image={selectedImage}
        onClose={() => setSelectedImage(null)}
        city={city}
      />
    </div>
  );
}
