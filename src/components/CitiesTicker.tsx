import { useRef, useCallback, useMemo, useEffect } from "react";
import { COLORS } from "../constants/colors";
import { cityGalleries } from "../data/images";

// Move constants outside component to prevent recreation
const CITIES = [
  "NEW YORK",
  "PARIS",
  "LONDON",
  "CHICAGO",
  "MIAMI",
  "SHANGHAI",
  "BERLIN",
  "VIENNA",
  "MELBOURNE",
  "TOKYO",
];

const ROW_SIZE = 4;
const DUPLICATE_COUNT = 200; // Significantly increased for an even longer, smoother animation

const getCloudinaryUrl = (
  publicId: string,
  options?: { lowQuality?: boolean }
) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const transformations = options?.lowQuality
    ? "w_100,e_blur:1000,q_1,f_auto" // Tiny placeholder
    : "q_auto:good,f_auto,w_800"; // Full quality image
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`;
};

// Preload both full quality and low quality versions of images
const preloadImagesForCity = (cityName: string) => {
  const cityKey = Object.keys(cityGalleries).find(
    (key) => key.toLowerCase() === cityName.toLowerCase()
  );

  if (!cityKey) return;

  const gallery = cityGalleries[cityKey];
  gallery.images.forEach((image) => {
    // Preload full quality version
    const fullQualityImg = new Image();
    fullQualityImg.src = getCloudinaryUrl(image.publicId);

    // Preload low quality version
    const lowQualityImg = new Image();
    lowQualityImg.src = getCloudinaryUrl(image.publicId, { lowQuality: true });
  });
};

interface CitiesTickerProps {
  onCityClick: (city: string, rect: DOMRect) => void;
  isPaused: boolean;
}

export function CitiesTicker({ onCityClick, isPaused }: CitiesTickerProps) {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const tickerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const preloadedCities = useRef<Set<string>>(new Set());

  const rows: string[][] = useMemo(() => {
    const calculatedRows: string[][] = [];
    for (let i = 0; i < CITIES.length; i += ROW_SIZE) {
      calculatedRows.push(CITIES.slice(i, i + ROW_SIZE));
    }
    return calculatedRows;
  }, []);

  // Create duplicates for infinite scroll
  const createDuplicates = useCallback((arr: string[]) => {
    let duplicatedArr = [...arr];
    for (let i = 0; i < DUPLICATE_COUNT; i++) {
      duplicatedArr = [...duplicatedArr, ...arr];
    }
    return duplicatedArr;
  }, []);

  const rowDuplicates = useMemo(() => {
    return rows.map(createDuplicates);
  }, [rows, createDuplicates]);

  // Event handlers with improved performance using event delegation
  const handleRowClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, _rowIndex: number) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("city-text")) {
        const city = target.textContent || "";
        const rect = target.getBoundingClientRect();
        onCityClick(city, rect);
      }
    },
    [onCityClick]
  );

  const handleCityHover = useCallback((city: string) => {
    if (!preloadedCities.current.has(city)) {
      preloadedCities.current.add(city);
      preloadImagesForCity(city);
    }
  }, []);

  // Reset animation on window resize for smooth experience
  useEffect(() => {
    let rafId: number;
    const handleResize = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      rafId = requestAnimationFrame(() => {
        tickerRefs.current.forEach((ref) => {
          if (ref) {
            ref.style.animation = "none";
            ref.offsetHeight; // Trigger reflow
            ref.style.animation = "";
          }
        });
      });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="max-w-full mx-auto py-20">
      {rowDuplicates.map((rowDuplicate: string[], rowIndex: number) => (
        <div
          key={rowIndex}
          className={`relative w-full overflow-hidden ${
            rowIndex !== rowDuplicates.length - 1 ? "mb-8" : ""
          }`}
          onClick={(e) => handleRowClick(e, rowIndex)}
        >
          <div
            ref={(el) => {
              tickerRefs.current[rowIndex] = el;
            }}
            className={`ticker-row inline-flex gap-16 ${
              isPaused ? "paused" : ""
            }`}
            style={{
              transform: `translateX(${rowIndex % 2 === 0 ? "0%" : "-40%"})`,
              animationName:
                rowIndex % 2 === 0
                  ? "ticker-right-to-left"
                  : "ticker-left-to-right",
              animationDirection: rowIndex % 2 === 0 ? "normal" : "reverse",
            }}
          >
            {rowDuplicate.map((city: string, index: number) => (
              <span
                key={`${city}-${index}`}
                className="city-text text-6xl tracking-widest font-bold cursor-pointer flex-shrink-0"
                style={{
                  color: COLORS.dark,
                  fontFamily: "Helvetica, Arial, sans-serif",
                }}
                onMouseEnter={() => handleCityHover(city)}
              >
                {city}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
