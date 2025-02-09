import { useRef, useCallback, useMemo, useEffect } from "react";
import { COLORS } from "../constants/colors";

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
const DUPLICATE_COUNT = 24; // Back to 24 duplicates for smoother animation

interface CitiesTickerProps {
  onCityClick: (city: string, rect: DOMRect) => void;
  isPaused: boolean;
}

export function CitiesTicker({ onCityClick, isPaused }: CitiesTickerProps) {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const tickerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const rows: string[][] = useMemo(() => {
    const calculatedRows: string[][] = [];
    for (let i = 0; i < CITIES.length; i += ROW_SIZE) {
      calculatedRows.push(CITIES.slice(i, i + ROW_SIZE));
    }
    return calculatedRows;
  }, []); // Dependencies removed since CITIES and ROW_SIZE are now constants

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
    (e: React.MouseEvent<HTMLDivElement>, rowIndex: number) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("city-text")) {
        const city = target.textContent || "";
        const rect = target.getBoundingClientRect();
        onCityClick(city, rect);
      }
    },
    [onCityClick]
  );

  // Reset animation on window resize for smooth experience
  useEffect(() => {
    let rafId: number;
    const handleResize = () => {
      // Cancel any existing animation frame
      if (rafId) {
        cancelAnimationFrame(rafId);
      }

      // Schedule the reset in the next frame
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
