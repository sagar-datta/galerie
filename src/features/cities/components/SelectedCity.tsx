import { useEffect, useState, memo } from "react";
import { COLORS } from "../../../constants/colors";
import { ImageGallery } from "../../../features/gallery/components/ImageGallery";
import { cityGalleries } from "../../../lib/data";
import { GalleryImage } from "../../../features/gallery/types/gallery.types";
import { formatVisitDates } from "../../../lib/data/metadata/cities";
import { selectedCityStyles } from "../constants/ui";
import { SelectedCityProps } from "../types";
import { useSelectedCityAnimation } from "../hooks/useSelectedCityAnimation";
import { formatCityDisplay } from "../utils/format";

// Memoize gallery component to prevent unnecessary rerenders
const MemoizedGallery = memo(ImageGallery);

export function SelectedCity({
  city,
  position,
  onReturn,
  isReturning,
  isDirectAccess = false,
}: SelectedCityProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [cityWidth, setCityWidth] = useState(0);

  const {
    showGalleryTransition,
    footerHeight,
    setFooterHeight,
    animateSelectedCityIn,
    animateSelectedCityOut,
  } = useSelectedCityAnimation({
    position,
    isDirectAccess,
  });

  useEffect(() => {
    const selectedCityElement = document.getElementById(
      "selected-city-element"
    );
    if (selectedCityElement && showGalleryTransition) {
      const width = selectedCityElement.getBoundingClientRect().width;
      setCityWidth(width);
    }
  }, [showGalleryTransition]);

  // Find city gallery once
  const cityGallery =
    cityGalleries[
      Object.keys(cityGalleries).find(
        (key) => key.toLowerCase() === city.toLowerCase()
      ) || ""
    ];

  useEffect(() => {
    if (isReturning) {
      animateSelectedCityOut();
    } else {
      animateSelectedCityIn();
      const timer = setTimeout(() => {
        setFooterHeight("h-[16.67vh]");
      }, 16);
      return () => clearTimeout(timer);
    }
  }, [
    animateSelectedCityIn,
    animateSelectedCityOut,
    isReturning,
    setFooterHeight,
  ]);

  return (
    <div
      className="fixed top-0 left-0 w-full h-full z-50"
      style={selectedCityStyles.container}
    >
      <button
        onClick={onReturn}
        className={`return-button ${
          showGalleryTransition && !selectedImage
            ? "return-button-visible"
            : "return-button-hidden"
        }`}
        style={selectedCityStyles.returnButton}
      >
        <span>Return</span>
      </button>

      {cityGallery && showGalleryTransition && (
        <div
          className="absolute inset-x-0 bottom-[16.67vh] top-0 pt-28 pb-12"
          style={selectedCityStyles.galleryContainer}
        >
          <MemoizedGallery
            city={city}
            images={cityGallery.images}
            selectedImage={selectedImage}
            onImageSelect={setSelectedImage}
          />
        </div>
      )}

      <div
        className={`fixed bottom-0 left-0 w-full transition-height duration-300 ease-in-out ${footerHeight}`}
        style={selectedCityStyles.footer}
      >
        {showGalleryTransition && (
          <div
            className="absolute top-1/2 w-full"
            style={{
              ...selectedCityStyles.footerText,
              transform: showGalleryTransition
                ? "translateY(-50%)"
                : "translateY(20px)",
              opacity: showGalleryTransition ? 1 : 0,
              paddingLeft: `${cityWidth + 96}px`,
              maxWidth: "calc(100% - 4rem)",
            }}
          >
            <p>{formatVisitDates(city)}</p>
          </div>
        )}
      </div>

      <div
        className={`tracking-widest font-bold ${
          showGalleryTransition ? "text-[clamp(1.75rem,8vh,5rem)]" : "text-6xl"
        }`}
        style={{
          ...selectedCityStyles.cityText,
          position: "fixed",
          top: isDirectAccess ? "91.66%" : `${position.top}px`,
          left: isDirectAccess ? "2rem" : `${position.left}px`,
          transform: isDirectAccess ? "translateY(-50%)" : "none",
          color: isDirectAccess ? COLORS.white : COLORS.dark,
          opacity: isDirectAccess ? 0 : 1,
          transition: "none",
        }}
        id="selected-city-element"
      >
        {formatCityDisplay(city)}
      </div>
    </div>
  );
}
