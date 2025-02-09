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

  // Find city gallery case-insensitively
  const cityKey = Object.keys(cityGalleries).find(
    (key) => key.toLowerCase() === city.toLowerCase()
  );

  const cityGallery = cityKey ? cityGalleries[cityKey] : undefined;

  // Debug logs
  console.log("SelectedCity props:", { city, position, isReturning });
  console.log("Available cities:", Object.keys(cityGalleries));
  console.log("ShowGallery state:", showGallery);
  console.log("Found city key:", cityKey);
  console.log("CityGallery found:", cityGallery);

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
            console.log("Setting showGallery to true");
            setShowGallery(true);
          }, 500);
        }, 16); // Approximately one frame at 60fps
      });
    }
  }, []);

  const animateSelectedCityOut = useCallback(() => {
    console.log("Animating out, setting showGallery to false");
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
      className="fixed top-0 left-0 w-full h-full z-50 overflow-y-auto"
      style={{ backgroundColor: COLORS.beige }}
    >
      <button
        onClick={onReturn}
        className="fixed top-4 left-4 px-6 py-3 text-xl font-bold z-50"
        style={{
          backgroundColor: COLORS.dark,
          color: COLORS.beige,
        }}
      >
        Return
      </button>
      <div
        className={`fixed bottom-0 left-0 w-full transition-height duration-300 ease-in-out ${footerHeight}`}
        style={{ backgroundColor: COLORS.coral }}
      ></div>
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
        {cityKey || city}
      </div>
      {showGallery && cityGallery && (
        <div
          className="w-full min-h-screen pt-20 pb-32"
          style={{
            opacity: showGallery ? 1 : 0,
            transition: "opacity 0.5s ease",
          }}
        >
          <ImageGallery city={cityKey || city} images={cityGallery.images} />
        </div>
      )}
    </div>
  );
}
