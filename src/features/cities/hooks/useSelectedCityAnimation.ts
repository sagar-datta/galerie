import { useCallback, useState } from "react";
import { COLORS } from "../../../constants/colors";

interface UseSelectedCityAnimationProps {
  position: { top: number; left: number };
  isDirectAccess: boolean;
}

export function useSelectedCityAnimation({
  position,
  isDirectAccess,
}: UseSelectedCityAnimationProps) {
  const [showGalleryTransition, setShowGalleryTransition] = useState(false);
  const [footerHeight, setFooterHeight] = useState("h-[6rem]");

  const animateSelectedCityIn = useCallback(() => {
    const selectedCityElement = document.getElementById(
      "selected-city-element"
    );
    if (!selectedCityElement) return;

    if (isDirectAccess) {
      selectedCityElement.style.transition = "opacity 0.5s ease-in-out";
      selectedCityElement.style.opacity = "1";
      selectedCityElement.style.color = COLORS.white;
      setShowGalleryTransition(true);
    } else {
      selectedCityElement.style.transition = "none";
      selectedCityElement.style.opacity = "1";
      selectedCityElement.getBoundingClientRect();

      requestAnimationFrame(() => {
        selectedCityElement.style.transition =
          "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
        selectedCityElement.style.top = "91.66%";
        selectedCityElement.style.left = "2rem";
        selectedCityElement.style.transform = "translateY(-50%)";
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

  return {
    showGalleryTransition,
    footerHeight,
    setFooterHeight,
    animateSelectedCityIn,
    animateSelectedCityOut,
  };
}
