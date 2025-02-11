import { GalleryImage } from "../../types/gallery.types";
import {
  getCloudinaryUrl,
  formatDateTime,
  getGoogleMapsUrl,
  formatGpsCoordinates,
} from "./utils";
import {
  memo,
  useMemo,
  useState,
  useCallback,
  MouseEvent,
  useEffect,
} from "react";

interface ImageModalProps {
  image: GalleryImage | null;
  onClose: () => void;
  city: string;
}

export const ImageModal = memo(({ image, onClose, city }: ImageModalProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setIsFullscreen(false);
  }, [image]);

  const cursorStyle = useMemo(() => {
    // Conservative dimensions for browser compatibility
    const minWidth = 128;
    const maxWidth = 180; // Reduced maximum width
    const arrowSpace = 40; // Slightly reduced arrow space

    // Calculate font size based on city length
    const fontSize = city.length > 6 ? 12 : 18;

    // Calculate dimensions with fixed proportions
    const charWidth = fontSize === 18 ? 10 : 7;
    const textWidth = city.length * charWidth;
    const padding = Math.max(16, Math.min(24, textWidth * 0.15));
    const calculatedWidth = Math.min(
      Math.max(minWidth, textWidth + arrowSpace + padding),
      maxWidth
    );

    // Position text
    const textX = calculatedWidth / 2 + 16;
    const textY = fontSize === 18 ? 22 : 20;

    return {
      cursor: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${calculatedWidth} 32' width='${calculatedWidth}' height='32'><rect x='6' y='6' width='${
        calculatedWidth - 8
      }' height='26' rx='1' fill='%23EBE9D1'/><rect x='3' y='3' width='${
        calculatedWidth - 8
      }' height='26' rx='1' fill='%23FF685B'/><g stroke='%23131313' stroke-linecap='square' stroke-width='3' fill='none'><path d='M20 16h18'></path><path d='m24 11l-6 5l6 5'></path></g><text x='${textX}' y='${textY}' fill='%23131313' text-anchor='middle' font-size='${fontSize}' font-family='Helvetica' font-weight='900' stroke='%23131313' stroke-width='0.5'>${city}</text></svg>") 16 16, auto`,
    };
  }, [city]);

  const mapsUrl = useMemo(() => {
    if (!image?.metadata?.gpsLatitude || !image?.metadata?.gpsLongitude)
      return null;
    return getGoogleMapsUrl(
      image.metadata.gpsLatitude,
      image.metadata.gpsLongitude
    );
  }, [image?.metadata?.gpsLatitude, image?.metadata?.gpsLongitude]);

  const handleImageClick = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    setIsFullscreen((prev) => !prev);
  }, []);

  if (!image) return null;

  return (
    <div
      className={`fixed inset-0 flex z-50 backdrop-blur-sm modal-enter transition-colors duration-500 ${
        isFullscreen ? "bg-[#131313]/90" : "bg-[#131313]/75"
      }`}
      onClick={onClose}
      style={cursorStyle}
    >
      <div className="w-full flex flex-col h-screen">
        <div
          className={`relative flex-1 min-h-0 flex items-center justify-center ${
            !isFullscreen ? "p-8" : ""
          }`}
        >
          <img
            src={getCloudinaryUrl(image.publicId)}
            alt={image.caption || `Photo from ${city}`}
            className={`
              select-none object-contain
              ${
                isFullscreen
                  ? "w-full h-full"
                  : "max-h-full max-w-[95vw] border-15 border-[#EBE9D1]"
              }
            `}
            onClick={handleImageClick}
            onDragStart={(e) => e.preventDefault()}
            style={{
              cursor: isFullscreen ? "zoom-out" : "zoom-in",
            }}
          />
        </div>
        {!isFullscreen && (
          <div
            className="flex-shrink-0 bg-[#131313] text-white p-4 cursor-default flex items-center gap-8 overflow-x-auto transition-opacity duration-500"
            onClick={(e) => e.stopPropagation()}
          >
            {image.caption && (
              <div className="flex-1">
                <h3 className="text-sm uppercase tracking-wide text-gray-400">
                  Caption
                </h3>
                <p className="text-base">{image.caption}</p>
              </div>
            )}
            {image.metadata && (
              <>
                {image.metadata.dateTaken && (
                  <div className="flex-none">
                    <h3 className="text-sm uppercase tracking-wide text-gray-400">
                      Date Taken
                    </h3>
                    <p className="text-base">
                      {formatDateTime(image.metadata.dateTaken)}
                    </p>
                  </div>
                )}
                {(image.metadata.make || image.metadata.model) && (
                  <div className="flex-none">
                    <h3 className="text-sm uppercase tracking-wide text-gray-400">
                      Device
                    </h3>
                    <p className="text-base">
                      {[image.metadata.make, image.metadata.model]
                        .filter(Boolean)
                        .join(" ")}
                    </p>
                  </div>
                )}
                {image.metadata.gpsLatitude &&
                  image.metadata.gpsLongitude &&
                  mapsUrl && (
                    <div className="flex-none">
                      <h3 className="text-sm uppercase tracking-wide text-gray-400">
                        Coordinates
                      </h3>
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base font-mono text-[#FF685B] hover:text-[#ff8672] transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {formatGpsCoordinates(
                          image.metadata.gpsLatitude,
                          image.metadata.gpsLongitude
                        )}
                      </a>
                    </div>
                  )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

ImageModal.displayName = "ImageModal";
