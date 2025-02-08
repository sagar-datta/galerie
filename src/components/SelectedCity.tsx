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
      selectedCityElement.style.transition =
        "top 0.5s ease-in-out, left 0.5s ease-in-out, transform 0.5s ease-in-out, opacity 0.5s ease-in-out";
      selectedCityElement.style.top = "50%";
      selectedCityElement.style.left = "2rem";
      selectedCityElement.style.transform = "translateY(-50%)";
    }
  }, []);

  const animateSelectedCityOut = useCallback(() => {
    const selectedCityElement = document.getElementById(
      "selected-city-element"
    );
    if (selectedCityElement) {
      selectedCityElement.style.transition =
        "top 0.3s ease-in-out, left 0.3s ease-in-out, transform 0.3s ease-in-out, opacity 0.3s ease-in-out";
      selectedCityElement.style.top = `${position.top}px`;
      selectedCityElement.style.left = `${position.left}px`;
      selectedCityElement.style.transform = "translateY(0%) translateX(0%)";
      selectedCityElement.style.opacity = "0";
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
        }}
        id="selected-city-element"
      >
        {city}
      </div>
    </div>
  );
}
