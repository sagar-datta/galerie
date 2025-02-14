import { useRef, useCallback, useMemo, useState } from "react";
import { GalleryImage } from "../types/gallery.types";
import { ImageModal } from "./ImageModal";
import { getCloudinaryUrl, createImageRows } from "../utils";
import {
  useImagePreload,
  useLoadedStates,
  useGalleryCentering,
  useResponsiveRows,
  useGalleryScroll,
} from "../hooks";

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

  // Custom hooks for gallery functionality
  const { preloadImage, preloadFullscreenImage } = useImagePreload(images);
  const { loadedStates, handleImageLoad } = useLoadedStates();
  const numRows = useResponsiveRows();

  useGalleryCentering({
    containerRef: scrollContainerRef,
    onCenteringChange: setShouldCenter,
  });

  useGalleryScroll({
    containerRef: scrollContainerRef,
    images,
    onImagePreload: preloadImage,
  });

  const handleImageClick = useCallback(
    (image: GalleryImage) => {
      onImageSelect(image);
    },
    [onImageSelect]
  );

  // Memoize image rows calculation
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
                  }}
                  data-index={rowIndex * row.length + imageIndex}
                  onClick={() => handleImageClick(image)}
                  onMouseEnter={() => {
                    preloadFullscreenImage(image.publicId);
                  }}
                >
                  {/* Skeleton loader */}
                  <div className={`image-skeleton ${loadedStates[image.id] >= 1 ? 'loaded' : ''}`} />

                  {/* Low quality placeholder */}
                  <div
                    className={`absolute inset-0 ${
                      loadedStates[image.id] >= 1 ? "opacity-0" : "opacity-100"
                    }`}
                    style={{
                      background: `url(${getCloudinaryUrl(
                        encodeURIComponent(image.publicId),
                        {
                          lowQuality: true,
                        }
                      )})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />

                  {/* Medium quality image */}
                  <img
                    src={getCloudinaryUrl(encodeURIComponent(image.publicId), {
                      mediumQuality: true,
                      priority: rowIndex === 0 && imageIndex < 2,
                    })}
                    alt={image.metadata?.caption || `Photo from ${city}`}
                    className={`gallery-image w-full h-full object-cover transition-opacity duration-300 blur-up ${
                      loadedStates[image.id] >= 1
                        ? "opacity-100 loaded"
                        : "opacity-0"
                    }`}
                    loading={
                      rowIndex === 0 || imageIndex < 2 ? "eager" : "lazy"
                    }
                    onLoad={() => handleImageLoad(image.id, "medium")}
                  />

                  {/* Full quality image */}
                  <img
                    src={getCloudinaryUrl(encodeURIComponent(image.publicId), {
                      priority: rowIndex === 0 && imageIndex < 2,
                    })}
                    alt={image.metadata?.caption || `Photo from ${city}`}
                    className={`gallery-image absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
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
