import { GalleryImage } from "../../types/gallery.types";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { ImageModal } from "./ImageModal";
import { getCloudinaryUrl } from "./utils";
import "./ImageGallery.css";

// Updated createImageRows to allow dynamic number of rows
const createImageRows = (images: GalleryImage[], numRows: number = 2) => {
  const rows: GalleryImage[][] = Array.from({ length: numRows }, () => []);
  images.forEach((image, index) => {
    rows[index % numRows].push(image);
  });
  return rows;
};

interface ImageGalleryProps {
  city: string;
  images: GalleryImage[];
  selectedImage: GalleryImage | null;
  onImageSelect: (image: GalleryImage | null) => void;
}

export function ImageGallery({
  city,
  images,
  selectedImage,
  onImageSelect,
}: ImageGalleryProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [shouldCenter, setShouldCenter] = useState(true);
  const [loadedStates, setLoadedStates] = useState<Record<string, number>>({});
  const [numRows, setNumRows] = useState(2);
  const WINDOW_HEIGHT_THRESHOLD = 700;

  const handleImageClick = useCallback(
    (image: GalleryImage) => {
      onImageSelect(image);
    },
    [onImageSelect]
  );

  const checkIfShouldCenter = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const shouldCenterNew = container.scrollWidth <= container.clientWidth;
    setShouldCenter(shouldCenterNew);
  }, []);

  // Preload first 4 images at medium quality
  useEffect(() => {
    const preloadImages = images.slice(0, 4);
    const links: HTMLLinkElement[] = [];
    preloadImages.forEach((image) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = getCloudinaryUrl(image.publicId, { mediumQuality: true });
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

  useEffect(() => {
    const updateNumRows = () => {
      if (window.innerHeight <= WINDOW_HEIGHT_THRESHOLD) {
        setNumRows(1);
      } else {
        setNumRows(2);
      }
    };
    updateNumRows();
    window.addEventListener("resize", updateNumRows);
    return () => window.removeEventListener("resize", updateNumRows);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const wheelHandler = (e: WheelEvent) => {
      if (!container) return;
      e.preventDefault();
      if (Math.abs(e.deltaX) > 0) {
        container.scrollLeft += e.deltaX;
        return;
      }
      container.scrollLeft += e.deltaY * 2.5;
    };

    container.addEventListener("wheel", wheelHandler, { passive: false });
    return () => container.removeEventListener("wheel", wheelHandler);
  }, []);

  const handleImageLoad = useCallback(
    (imageId: string, quality: "medium" | "full") => {
      setLoadedStates((prev) => ({
        ...prev,
        [imageId]: quality === "medium" ? 1 : 2,
      }));
    },
    []
  );

  // Memoize image rows calculation with dynamic number of rows
  const imageRows = useMemo(
    () => createImageRows(images, numRows),
    [images, numRows]
  );

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
              className="flex gap-8 px-10"
              style={{
                height: numRows === 1 ? "100%" : "calc(50% - 0.25rem)",
              }}
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
                  {/* Medium quality image */}
                  <img
                    src={getCloudinaryUrl(image.publicId, {
                      mediumQuality: true,
                    })}
                    alt={image.caption || `Photo from ${city}`}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${
                      loadedStates[image.id] >= 1 ? "opacity-100" : "opacity-0"
                    }`}
                    loading={
                      rowIndex === 0 || imageIndex < 2 ? "eager" : "lazy"
                    }
                    onLoad={() => handleImageLoad(image.id, "medium")}
                  />

                  {/* Full quality image */}
                  <img
                    src={getCloudinaryUrl(image.publicId)}
                    alt={image.caption || `Photo from ${city}`}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                      loadedStates[image.id] === 2 ? "opacity-100" : "opacity-0"
                    }`}
                    loading="lazy"
                    onLoad={() => handleImageLoad(image.id, "full")}
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
        onClose={() => onImageSelect(null)}
        city={city}
      />
    </div>
  );
}
