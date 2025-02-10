import { GalleryImage } from "../../types/gallery.types";
import { COLORS } from "../../constants/colors";
import { getCloudinaryUrl } from "./utils";
import { useState, useEffect, memo, useMemo } from "react";

interface ImageModalProps {
  image: GalleryImage | null;
  onClose: () => void;
  city: string;
}

export const ImageModal = memo(({ image, onClose, city }: ImageModalProps) => {
  const [isClosing, setIsClosing] = useState(false);

  const cursorStyle = useMemo(() => {
    const minWidth = 128;
    const maxWidth = 300; // Maximum width to avoid browser issues
    const charWidth = 10;
    const textWidth = city.length * charWidth;
    const padding = Math.max(16, textWidth * 0.2); // Dynamic padding, at least 16px
    const calculatedWidth = Math.min(
      Math.max(minWidth, textWidth + 2 * padding),
      maxWidth
    );
    const textX = calculatedWidth / 2 + 16;

    return {
      cursor: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${calculatedWidth} 32' width='${calculatedWidth}' height='32'><rect x='6' y='6' width='${
        calculatedWidth - 8
      }' height='26' rx='1' fill='%23EBE9D1'/><rect x='3' y='3' width='${
        calculatedWidth - 8
      }' height='26' rx='1' fill='%23FF685B'/><g stroke='%23131313' stroke-linecap='square' stroke-width='3' fill='none'><path d='M20 16h18'></path><path d='m24 11l-6 5l6 5'></path></g><text x='${textX}' y='22' fill='%23131313' text-anchor='middle' font-size='18' font-family='Helvetica' font-weight='900' stroke='%23131313' stroke-width='0.5'>${city}</text></svg>") 16 16, auto`,
    };
  }, [city]);

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
      className={`fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-lg ${
        isClosing ? "modal-exit" : "modal-enter"
      }`}
      onClick={handleClose}
      style={cursorStyle}
    >
      <div className="flex gap-6 max-w-[95vw]">
        <img
          src={getCloudinaryUrl(image.publicId)}
          alt={image.caption || `Photo from ${city}`}
          className="max-h-[90vh] max-w-[70vw] object-contain cursor-default relative transform -translate-x-2 -translate-y-2"
          style={{
            boxShadow: `6px 6px 0 ${COLORS.black}`,
          }}
          onClick={(e) => e.stopPropagation()}
        />
        <div
          className="p-6 w-[300px] text-white self-center cursor-default relative transform -translate-x-2 -translate-y-2"
          style={{
            backgroundColor: COLORS.dark,
            boxShadow: `6px 6px 0 ${COLORS.black}`,
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
