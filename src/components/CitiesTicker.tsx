import { useRef, useCallback, useMemo, useEffect, useState } from "react";
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

const MIN_ROW_HEIGHT = 120; // Increased for better spacing
const ROW_MARGIN = 32; // 8rem margin between rows
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
  const [availableRows, setAvailableRows] = useState(3); // Default to 3 rows

  // Calculate rows based on available height
  const calculateRows = useCallback(() => {
    if (!containerRef.current) return;

    const viewport = window.innerHeight;
    const containerTop = containerRef.current.getBoundingClientRect().top;

    // Add buffer to ensure we collapse before content gets cut off
    const safetyBuffer = 20;
    const bottomMargin = 80; // Increased margin to trigger earlier collapse

    // Calculate available space excluding margins and buffer
    const availableSpace =
      viewport - containerTop - bottomMargin - safetyBuffer;

    // Calculate space needed for text content plus margins
    const spacePerRow = MIN_ROW_HEIGHT + ROW_MARGIN;

    // Calculate max rows that can fit without cutting off
    let maxRows = Math.floor(availableSpace / spacePerRow);
    maxRows = Math.max(1, Math.min(3, maxRows));

    setAvailableRows(maxRows);
  }, []);

  // Create dynamic rows based on available space
  const rows = useMemo(() => {
    const citiesPerRow = Math.ceil(CITIES.length / availableRows);
    const calculatedRows: string[][] = [];

    for (let i = 0; i < CITIES.length; i += citiesPerRow) {
      calculatedRows.push(CITIES.slice(i, i + citiesPerRow));
    }

    return calculatedRows;
  }, [availableRows]);

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

  // Initialize ResizeObserver and handle window resize
  useEffect(() => {
    let resizeObserver: ResizeObserver;

    const handleResize = () => {
      calculateRows();

      requestAnimationFrame(() => {
        tickerRefs.current.forEach((ref, index) => {
          if (ref) {
            const isRightToLeft = index % 2 === 0;
            ref.style.animation = "none";
            ref.offsetHeight; // Trigger reflow
            ref.style.animation = `${
              isRightToLeft ? "ticker-right-to-left" : "ticker-left-to-right"
            } 14400s linear infinite ${isRightToLeft ? "normal" : "reverse"}`;
          }
        });
      });
    };

    if (containerRef.current) {
      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(containerRef.current);
      resizeObserver.observe(document.body); // Observe body for footer changes
    }

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial calculation

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [calculateRows]);

  return (
    <div
      ref={containerRef}
      className="max-w-full mx-auto py-20"
      style={{ minHeight: `${MIN_ROW_HEIGHT * availableRows}px` }}
    >
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
            className={`ticker-row inline-flex ${isPaused ? "paused" : ""}`}
            data-rows={availableRows}
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
