import { GalleryImage } from "../../types/gallery.types";
import { COLORS } from "../../constants/colors";
import { getCloudinaryUrl } from "./utils";
import { useState, useEffect, memo } from "react";

interface ImageModalProps {
  image: GalleryImage | null;
  onClose: () => void;
  city: string;
}

export const ImageModal = memo(({ image, onClose, city }: ImageModalProps) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (image) {
      setIsClosing(false);
    }
  }, [image]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 50);
  };

  if (!image) return null;

  const aspectRatio = (image.width / image.height).toFixed(2);

  return (
    <div
      className={`fixed inset-0 bg-black/80 flex items-center justify-center z-50 ${
        isClosing ? "modal-exit" : "modal-enter"
      }`}
      onClick={handleClose}
      style={{
        cursor: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='110' height='24' viewBox='0 0 110 24'><rect width='110' height='24' fill='%23ff685b'/><text x='55' y='16' fill='%231a1a1a' font-family='Arial' font-size='12' font-weight='bold' letter-spacing='1' text-anchor='middle'>BACK TO ${city.toUpperCase()}</text></svg>") 55 12, auto`,
      }}
    >
      <div className="flex gap-6 max-w-[95vw]">
        <img
          src={getCloudinaryUrl(image.publicId)}
          alt={image.caption || `Photo from ${city}`}
          className="max-h-[90vh] max-w-[70vw] object-contain cursor-default relative transform -translate-x-2 -translate-y-2"
          style={{
            boxShadow: `6px 6px 0 ${COLORS.dark}`,
          }}
          onClick={(e) => e.stopPropagation()}
        />
        <div
          className="p-6 w-[300px] text-white self-center cursor-default relative transform -translate-x-2 -translate-y-2"
          style={{
            backgroundColor: COLORS.dark,
            boxShadow: `6px 6px 0 ${COLORS.coral}`,
          }}
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
});

ImageModal.displayName = "ImageModal";
