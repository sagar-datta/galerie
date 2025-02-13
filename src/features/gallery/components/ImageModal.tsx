import { memo, MouseEvent } from "react";
import { GalleryImage } from "../types/gallery.types";
import { useImageModal } from "../hooks";
import {
  getCloudinaryUrl,
  formatDateTime,
  formatGpsCoordinates,
} from "../utils";

interface ImageModalProps {
  image: GalleryImage | null;
  onClose: () => void;
  city: string;
}

export const ImageModal = memo(({ image, onClose, city }: ImageModalProps) => {
  const { isFullscreen, cursorStyle, mapsUrl, toggleFullscreen } =
    useImageModal({
      image,
      city,
    });

  const handleImageClick = (e: MouseEvent) => {
    e.stopPropagation();
    toggleFullscreen();
  };

  if (!image) return null;

  return (
    <div
      className={`fixed inset-0 z-50 backdrop-blur-sm modal-enter transition-colors duration-500 ${
        isFullscreen ? "bg-black/92" : "bg-black/75"
      }`}
      onClick={onClose}
      style={cursorStyle}
    >
      <div className="h-screen flex flex-col">
        <div
          className={`flex-1 flex items-center justify-center ${
            !isFullscreen ? "p-8" : ""
          }`}
        >
          {isFullscreen ? (
            <div className="w-screen h-screen flex items-center justify-center">
              <img
                src={getCloudinaryUrl(image.publicId)}
                alt={image.caption || `Photo from ${city}`}
                className="w-auto h-screen object-contain select-none"
                onClick={handleImageClick}
                onDragStart={(e) => e.preventDefault()}
                style={{ cursor: "zoom-out" }}
              />
            </div>
          ) : (
            <div
              className="cursor-default border-15 border-[#EBE9D1]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={getCloudinaryUrl(image.publicId)}
                alt={image.caption || `Photo from ${city}`}
                className="h-[calc(100vh-12rem)] w-auto max-w-[95vw] object-contain select-none"
                onClick={handleImageClick}
                onDragStart={(e) => e.preventDefault()}
                style={{ cursor: "zoom-in" }}
              />
            </div>
          )}
        </div>
        {!isFullscreen && (
          <div
            className="flex-shrink-0 bg-[#131313] text-white p-4 cursor-default flex items-center gap-8 overflow-x-auto"
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
                        className="text-base font-mono text-[#FF685B] hover:text-[#ff8672] active:text-[#FF3420] transition-colors"
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
