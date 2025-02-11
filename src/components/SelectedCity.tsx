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
  const [cityWidth, setCityWidth] = useState(0);

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
        className={`return-button ${
          showGalleryTransition && !selectedImage
            ? "return-button-visible"
            : "return-button-hidden"
        }`}
        style={{
          backgroundColor: COLORS.dark,
          color: COLORS.beige,
        }}
      >
        <span>Return</span>
      </button>

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

      <div
        className={`fixed bottom-0 left-0 w-full transition-height duration-300 ease-in-out ${footerHeight}`}
        style={{ backgroundColor: COLORS.coral }}
      >
        {showGalleryTransition && (
          <div
            className="absolute top-1/2 w-full"
            style={{
              color: COLORS.dark,
              transform: showGalleryTransition
                ? "translateY(-50%)"
                : "translateY(20px)",
              opacity: showGalleryTransition ? 1 : 0,
              transition:
                "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease-in-out",
              fontSize: showGalleryTransition
                ? "clamp(1.25rem,4vh,2.5rem)"
                : "2rem",
              lineHeight: "1.3",
              fontWeight: 600,
              paddingLeft: `${cityWidth + 96}px`,
              maxWidth: "calc(100% - 4rem)",
              letterSpacing: "0.08em",
            }}
          >
            <p>
              {(() => {
                switch (city.toLowerCase()) {
                  case "paris":
                    return "The City of Light. An eternal symbol of romance and artistic excellence.";
                  case "new york":
                    return "The City That Never Sleeps. A melting pot of culture and dreams.";
                  case "london":
                    return "Where tradition meets innovation. A timeless metropolis.";
                  case "chicago":
                    return "The Windy City. Architecture that touches the sky.";
                  case "miami":
                    return "Vibrant rhythms. Where art deco meets azure waters.";
                  case "shanghai":
                    return "Pearl of the Orient. Where future meets tradition.";
                  case "berlin":
                    return "A canvas of history. The heart of European reinvention.";
                  case "vienna":
                    return "Imperial grandeur. The city of music and dreams.";
                  case "melbourne":
                    return "Cultural capital. Where lanes tell stories.";
                  case "tokyo":
                    return "Neon dreams. Where tradition flows into tomorrow.";
                  default:
                    return "A world of endless possibilities.";
                }
              })()}
            </p>
          </div>
        )}
      </div>

      <div
        className={`tracking-widest font-bold ${
          showGalleryTransition ? "text-[clamp(1.75rem,8vh,5rem)]" : "text-6xl"
        }`}
        style={{
          position: "fixed",
          top: isDirectAccess ? "91.66%" : `${position.top}px`,
          left: isDirectAccess ? "2rem" : `${position.left}px`,
          transform: isDirectAccess ? "translateY(-50%)" : "none",
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
