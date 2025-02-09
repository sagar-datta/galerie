import { useCallback, useEffect, useState } from "react";
import { COLORS } from "../constants/colors";
import { ImageGallery } from "./ImageGallery/ImageGallery";
import { cityGalleries } from "../data/images";

interface SelectedCityProps {
  city: string;
  position: { top: number; left: number };
  onReturn: () => void;
  isReturning: boolean;
}

export function SelectedCity({
  city,
  position,
  onReturn,
  isReturning,
}: SelectedCityProps) {
  const [footerHeight, setFooterHeight] = useState("h-[6rem]");
  const [showGallery, setShowGallery] = useState(false);

  // Find city gallery case-insensitively but preserve original city name
  const cityKey = Object.keys(cityGalleries).find(
    (key) => key.toLowerCase() === city.toLowerCase()
  );

  const cityGallery = cityKey ? cityGalleries[cityKey] : undefined;

  const animateSelectedCityIn = useCallback(() => {
    const selectedCityElement = document.getElementById(
      "selected-city-element"
    );
    if (selectedCityElement) {
      // Force a reflow to ensure initial position is rendered
      selectedCityElement.getBoundingClientRect();

      // Wait for next frame to establish initial position
      requestAnimationFrame(() => {
        // Add a tiny delay to ensure initial position is visible
        setTimeout(() => {
          selectedCityElement.style.transition =
            "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
          selectedCityElement.style.top = "91.66%"; // Position in coral bar
          selectedCityElement.style.left = "50%"; // Center horizontally
          selectedCityElement.style.transform = "translate(-50%, -50%)"; // Keep vertical centering
          selectedCityElement.style.color = COLORS.white; // Change color to white

          // Show gallery after city name animation
          setTimeout(() => {
            setShowGallery(true);
          }, 500);
        }, 16); // Approximately one frame at 60fps
      });
    }
  }, []);

  const animateSelectedCityOut = useCallback(() => {
    setShowGallery(false);
    const selectedCityElement = document.getElementById(
      "selected-city-element"
    );
    if (selectedCityElement) {
      // First animate the footer height
      setFooterHeight("h-[6rem]");

      // Then animate the city text
      selectedCityElement.style.transition =
        "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
      selectedCityElement.style.top = `${position.top}px`;
      selectedCityElement.style.left = `${position.left}px`;
      selectedCityElement.style.transform = "translate(0, 0)";
      selectedCityElement.style.color = COLORS.dark; // Reset color to dark

      // Only hide after animation completes
      selectedCityElement.addEventListener(
        "transitionend",
        () => {
          selectedCityElement.style.opacity = "0";
        },
        { once: true }
      );
    }
  }, [position]);

  useEffect(() => {
    animateSelectedCityIn();
    // Set the expanded footer height after a small delay
    const timer = setTimeout(() => {
      setFooterHeight("h-[16.67vh]");
    }, 16);
    return () => clearTimeout(timer);
  }, [animateSelectedCityIn]);

  useEffect(() => {
    if (isReturning) {
      animateSelectedCityOut();
    }
  }, [isReturning, animateSelectedCityOut]);

  return (
    <div
      className="fixed top-0 left-0 w-full h-full z-50"
      style={{ backgroundColor: COLORS.beige }}
    >
      <button
        onClick={onReturn}
        className="fixed top-8 left-8 px-6 py-3 text-xl font-bold z-50"
        style={{
          backgroundColor: COLORS.dark,
          color: COLORS.beige,
        }}
      >
        Return
      </button>

      {/* Gallery Container with more padding */}
      {showGallery && cityGallery && (
        <div
          className="absolute inset-x-0 bottom-[16.67vh] top-0 pt-28 pb-12"
          style={{
            opacity: showGallery ? 1 : 0,
            transition: "opacity 0.5s ease",
            overflow: "hidden",
          }}
        >
          <ImageGallery city={city} images={cityGallery.images} />
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
          top: `${position.top}px`,
          left: `${position.left}px`,
          color: COLORS.dark,
          fontFamily: "Helvetica, Arial, sans-serif",
          opacity: 1,
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
