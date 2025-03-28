import { memo, MouseEvent } from "react";
import { GalleryImage } from "../types/gallery.types";
import { useImageModal } from "../hooks";
import { useProgressiveImage } from "../hooks/useProgressiveImage";
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
  const { currentSrc: standardSrc } = useProgressiveImage(image?.publicId || "");
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

  const hasTopPanelData = image.metadata?.caption || 
    image.metadata?.dateTaken || 
    image.metadata?.model || 
    (image.metadata?.gpsLatitude && image.metadata?.gpsLongitude);

  // Original metadata panel (top)
  const TopMetadataPanel = ({ className }: { className: string }) => {
    if (!hasTopPanelData) return null;

    return (
      <div
        className={`flex-shrink-0 bg-[#131313] text-white p-4 cursor-default flex items-center gap-8 overflow-x-auto ${!image.metadata?.caption ? 'justify-center' : ''} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {image.metadata?.caption && (
          <div className="flex-1">
            <h3 className="text-sm uppercase tracking-wide text-gray-400">
              Caption
            </h3>
            <p className="text-base">{image.metadata.caption}</p>
          </div>
        )}
        {image.metadata?.dateTaken && (
          <div className="flex-none">
            <h3 className="text-sm uppercase tracking-wide text-gray-400">
              Date Taken
            </h3>
            <p className="text-base">
              {formatDateTime(image.metadata.dateTaken)}
            </p>
          </div>
        )}
        {image.metadata?.model && (
          <div className="flex-none">
            <h3 className="text-sm uppercase tracking-wide text-gray-400">
              Camera
            </h3>
            <p className="text-base">{image.metadata.model}</p>
          </div>
        )}
        {image.metadata?.gpsLatitude && image.metadata?.gpsLongitude && (
          <div className="flex-none">
            <h3 className="text-sm uppercase tracking-wide text-gray-400">
              Location
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
      </div>
    );
  };

  const hasBottomPanelData = image.metadata?.exposureTime || 
    image.metadata?.aperture || 
    image.metadata?.focalLength || 
    image.metadata?.iso || 
    image.metadata?.lensModel;

  // Technical metadata panel (bottom)
  const BottomTechnicalPanel = () => {
    if (!hasBottomPanelData) return null;
    
    return (
      <div
        className="flex-shrink-0 bg-[#131313] text-white p-4 cursor-default flex items-center justify-center gap-8 overflow-x-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {image.metadata?.exposureTime && (
          <div className="flex-none">
            <h3 className="text-sm uppercase tracking-wide text-gray-400">
              Shutter Speed
            </h3>
            <p className="text-base">
              <span className="font-mono">
                {image.metadata.exposureTime}s
              </span>
            </p>
          </div>
        )}
        {image.metadata?.aperture && (
          <div className="flex-none">
            <h3 className="text-sm uppercase tracking-wide text-gray-400">
              Aperture
            </h3>
            <p className="text-base">
              <span className="font-mono">ƒ/{image.metadata.aperture}</span>
            </p>
          </div>
        )}
        {image.metadata?.focalLength && (
          <div className="flex-none">
            <h3 className="text-sm uppercase tracking-wide text-gray-400">
              Focal Length
            </h3>
            <p className="text-base">
              <span className="font-mono">{image.metadata.focalLength}</span>
            </p>
          </div>
        )}
        {image.metadata?.iso && (
          <div className="flex-none">
            <h3 className="text-sm uppercase tracking-wide text-gray-400">
              ISO
            </h3>
            <p className="text-base">
              <span className="font-mono">{image.metadata.iso}</span>
            </p>
          </div>
        )}
        {image.metadata?.lensModel && (
          <div className="flex-none">
            <h3 className="text-sm uppercase tracking-wide text-gray-400">
              Lens Model
            </h3>
            <p className="text-base">
              <span className="font-mono">{image.metadata.lensModel}</span>
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`fixed inset-0 z-50 backdrop-blur-sm modal-enter transition-colors duration-500 custom-cursor ${
        isFullscreen ? "bg-black/92" : "bg-black/75"
      }`}
      onClick={onClose}
      style={cursorStyle}
    >
      <div className="h-screen flex flex-col">
        {!isFullscreen && hasTopPanelData && (
          <TopMetadataPanel className="border-b border-[#272727]" />
        )}
        <div className="flex-1 overflow-hidden flex items-center justify-center">
          {isFullscreen ? (
            <div className="w-screen h-screen flex items-center justify-center">
              <img
                src={getCloudinaryUrl(encodeURIComponent(image.publicId), { width: 2048, priority: true })}
                alt={image.metadata?.caption || `Photo from ${city}`}
                className="w-auto h-screen object-contain select-none"
                onClick={handleImageClick}
                onDragStart={(e) => e.preventDefault()}
                style={{ cursor: "zoom-out" }}
              />
            </div>
          ) : (
            <div className="py-4 px-8 max-h-full flex items-center justify-center">
              <div
                className="cursor-default border-15 border-[#EBE9D1]"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={standardSrc}
                  alt={image.metadata?.caption || `Photo from ${city}`}
                  className={`
                    max-w-[calc(100vw-4rem)] 
                    max-h-[calc(100vh-14rem)] 
                    w-auto h-auto 
                    object-contain select-none
                  `}
                  onClick={handleImageClick}
                  onDragStart={(e) => e.preventDefault()}
                  style={{ cursor: "zoom-in" }}
                />
              </div>
            </div>
          )}
        </div>
        {!isFullscreen && hasBottomPanelData && <BottomTechnicalPanel />}
      </div>
    </div>
  );
});

ImageModal.displayName = "ImageModal";
