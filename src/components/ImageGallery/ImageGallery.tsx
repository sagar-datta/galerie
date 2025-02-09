import { GalleryImage } from "../../types/gallery.types";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import "./ImageGallery.css";

interface ModalProps {
  image: GalleryImage | null;
  onClose: () => void;
  city: string;
}

function ImageModal({ image, onClose, city }: ModalProps) {
  if (!image) return null;

  const aspectRatio = (image.width / image.height).toFixed(2);

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      onClick={onClose}
      style={{
        cursor: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='110' height='24' viewBox='0 0 110 24'><rect width='110' height='24' rx='2' fill='%23ff685b'/><text x='50%' y='50%' fill='%231a1a1a' font-family='Arial' font-size='12' font-weight='bold' letter-spacing='1' text-anchor='middle' dominant-baseline='middle'>BACK TO ${city.toUpperCase()}</text></svg>") 55 12, auto`,
      }}
    >
      <div className="flex gap-6 max-w-[95vw]">
        <img
          src={getCloudinaryUrl(image.publicId)}
          alt={image.caption || `Photo from ${city}`}
          className="max-h-[90vh] max-w-[70vw] object-contain cursor-default"
          onClick={(e) => e.stopPropagation()}
        />
        <div
          className="bg-[#1a1a1a] p-6 w-[300px] text-white self-center cursor-default"
          onClick={(e) => e.stopPropagation()}
        >
          {image.caption && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Caption</h3>
              <p>{image.caption}</p>
            </div>
          )}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Location</h3>
              <p>{city}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Dimensions</h3>
              <p>
                {image.width} × {image.height}
              </p>
              <p className="text-sm text-gray-300 mt-1">
                Aspect Ratio: {aspectRatio}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const getCloudinaryUrl = (
  publicId: string,
  options?: { lowQuality?: boolean }
) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const transformations = options?.lowQuality
    ? "w_100,e_blur:1000,q_1,f_auto" // Tiny placeholder
    : "q_auto:good,f_auto,w_800"; // Full quality image with good compression
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`;
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
    preloadImages.forEach((image) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = getCloudinaryUrl(image.publicId);
      document.head.appendChild(link);
      return () => {
        document.head.removeChild(link);
      };
    });
  }, [images]);

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

  useEffect(() => {
    window.addEventListener("resize", checkIfShouldCenter);
    return () => window.removeEventListener("resize", checkIfShouldCenter);
  }, [checkIfShouldCenter]);

  const handleWheel = useCallback((e: WheelEvent) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    e.preventDefault();

    if (Math.abs(e.deltaX) > 0) {
      container.scrollLeft += e.deltaX;
      return;
    }

    container.scrollLeft += e.deltaY * 2.5;
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  const handleImageLoad = useCallback((imageId: string) => {
    setLoadedImages((prev) => new Set(prev).add(imageId));
  }, []);

  const imageRows = useMemo(() => {
    const rows: GalleryImage[][] = [[], []];
    images.forEach((image, index) => {
      rows[index % 2].push(image);
    });
    return rows;
  }, [images]);

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
