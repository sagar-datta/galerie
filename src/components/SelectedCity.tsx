import { useCallback, useEffect, useState, memo } from "react";
import { COLORS } from "../constants/colors";
import { ImageGallery } from "./ImageGallery/ImageGallery";
import { cityGalleries } from "../data/images";
import { GalleryImage } from "../types/gallery.types";

interface SelectedCityProps {
  city: string;
  position: { top: number; left: number };
  onReturn: () => void;
  isReturning: boolean;
  isDirectAccess?: boolean;
}

// Memoize gallery component to prevent unnecessary rerenders
const MemoizedGallery = memo(ImageGallery);

export function SelectedCity({
  city,
  position,
  onReturn,
  isReturning,
  isDirectAccess = false,
}: SelectedCityProps) {
  const [footerHeight, setFooterHeight] = useState("h-[6rem]");
  const [showGalleryTransition, setShowGalleryTransition] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isButtonVisible, setIsButtonVisible] = useState(true);

  // Handle button visibility with delay for opacity transition
  useEffect(() => {
    if (selectedImage) {
      setIsButtonVisible(false);
    } else {
      // Add small delay to ensure button is visible after modal closes
      const timer = setTimeout(() => {
        setIsButtonVisible(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [selectedImage]);

  // Find city gallery once
  const cityGallery =
    cityGalleries[
      Object.keys(cityGalleries).find(
        (key) => key.toLowerCase() === city.toLowerCase()
      ) || ""
    ];

  const animateSelectedCityIn = useCallback(() => {
    const selectedCityElement = document.getElementById(
      "selected-city-element"
    );
    if (!selectedCityElement) return;

    if (isDirectAccess) {
      // For direct URL access, just fade in
      selectedCityElement.style.transition = "opacity 0.5s ease-in-out";
      selectedCityElement.style.opacity = "1";
      selectedCityElement.style.color = COLORS.white;
      setShowGalleryTransition(true);
    } else {
      selectedCityElement.style.transition = "none";
      selectedCityElement.style.opacity = "1";
      // Force a reflow
      selectedCityElement.getBoundingClientRect();

      // Then start the animation
      requestAnimationFrame(() => {
        selectedCityElement.style.transition =
          "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
        selectedCityElement.style.top = "91.66%";
        selectedCityElement.style.left = "50%";
        selectedCityElement.style.transform = "translate(-50%, -50%)";
        selectedCityElement.style.color = COLORS.white;

        setShowGalleryTransition(true);
      });
    }
  }, [isDirectAccess]);

  const animateSelectedCityOut = useCallback(() => {
    setShowGalleryTransition(false);
    const selectedCityElement = document.getElementById(
      "selected-city-element"
    );
    if (!selectedCityElement) return;

    if (isDirectAccess) {
      selectedCityElement.style.transition = "opacity 0.3s ease-in-out";
      selectedCityElement.style.opacity = "0";
    } else {
      setFooterHeight("h-[6rem]");
      selectedCityElement.style.transition =
        "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
      selectedCityElement.style.top = `${position.top}px`;
      selectedCityElement.style.left = `${position.left}px`;
      selectedCityElement.style.transform = "none";
      selectedCityElement.style.color = COLORS.dark;
    }
  }, [position, isDirectAccess]);

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
  }, [animateSelectedCityIn, animateSelectedCityOut, isReturning]);

  return (
    <div
      className="fixed top-0 left-0 w-full h-full z-50"
      style={{ backgroundColor: COLORS.beige }}
    >
      <button
        onClick={onReturn}
        className={`fixed top-8 left-8 px-6 py-3 text-xl font-bold z-50 ${
          showGalleryTransition && !selectedImage
            ? "return-button-enter"
            : "return-button-exit"
        }`}
        style={{
          backgroundColor: COLORS.dark,
          color: COLORS.beige,
          visibility: isButtonVisible ? "visible" : "hidden",
          pointerEvents: isButtonVisible ? "auto" : "none",
          transition:
            "opacity 50ms ease-out, filter 50ms ease-out, transform 50ms ease-out",
        }}
      >
        Return
      </button>

      {/* Gallery Container - Only render if gallery exists and is transitioning */}
      {cityGallery && showGalleryTransition && (
        <div
          className="absolute inset-x-0 bottom-[16.67vh] top-0 pt-28 pb-12"
          style={{
            opacity: showGalleryTransition ? 1 : 0,
            transition: "opacity 0.5s ease",
            overflow: "hidden",
          }}
        >
          <MemoizedGallery
            city={city}
            images={cityGallery.images}
            selectedImage={selectedImage}
            onImageSelect={setSelectedImage}
          />
        </div>
      )}

      {/* Coral Footer */}
      <div
        className={`fixed bottom-0 left-0 w-full transition-height duration-300 ease-in-out ${footerHeight}`}
        style={{ backgroundColor: COLORS.coral }}
      />

      {/* City Name */}
      <div
        className="text-6xl tracking-widest font-bold"
        style={{
          position: "fixed",
          top: isDirectAccess ? "91.66%" : `${position.top}px`,
          left: isDirectAccess ? "50%" : `${position.left}px`,
          transform: isDirectAccess ? "translate(-50%, -50%)" : "none",
          color: isDirectAccess ? COLORS.white : COLORS.dark,
          fontFamily: "Helvetica, Arial, sans-serif",
          opacity: isDirectAccess ? 0 : 1,
          transition: "none",
          zIndex: 40,
        }}
        id="selected-city-element"
      >
        {city}
      </div>
    </div>
  );
}
