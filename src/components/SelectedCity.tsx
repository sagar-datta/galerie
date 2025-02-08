import { useCallback, useEffect } from "react";
import { COLORS } from "../constants/colors";

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
          selectedCityElement.style.top = "50%";
          selectedCityElement.style.left = "50%";
          selectedCityElement.style.transform = "translate(-50%, -50%)";
        }, 16); // Approximately one frame at 60fps
      });
    }
  }, []);

  const animateSelectedCityOut = useCallback(() => {
    const selectedCityElement = document.getElementById(
      "selected-city-element"
    );
    if (selectedCityElement) {
      selectedCityElement.style.transition =
        "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
      selectedCityElement.style.top = `${position.top}px`;
      selectedCityElement.style.left = `${position.left}px`;
      selectedCityElement.style.transform = "translate(0, 0)";

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
        className="fixed top-4 left-4 px-6 py-3 text-xl font-bold"
        style={{
          backgroundColor: COLORS.dark,
          color: COLORS.beige,
        }}
      >
        Return
      </button>
      <div
        className="text-6xl tracking-widest font-bold"
        style={{
          position: "absolute",
          top: `${position.top}px`,
          left: `${position.left}px`,
          color: COLORS.dark,
          fontFamily: "Helvetica, Arial, sans-serif",
          opacity: 1, // Start visible in original position
          transition: "none", // Disable initial transition
        }}
        id="selected-city-element"
      >
        {city}
      </div>
    </div>
  );
}
