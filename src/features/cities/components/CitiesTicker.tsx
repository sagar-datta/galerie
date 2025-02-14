import { useRef, useCallback } from "react";
import { COLORS } from "../../../constants/colors";
import { CitiesTickerProps } from "../types";
import { TICKER_CONFIG } from "../constants/ticker";
import { useResponsiveTicker } from "../hooks/useResponsiveTicker";
import { useTickerAnimation } from "../hooks/useTickerAnimation";
import { preloadImagesForCity } from "../utils/image";
import { citiesMetadata } from "../../../lib/data/metadata/cities";

export function CitiesTicker({ onCityClick, isPaused }: CitiesTickerProps) {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const tickerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const preloadedCities = useRef<Set<string>>(new Set());

  // Custom hooks
  const { availableRows, calculateRows, rowDuplicates } = useResponsiveTicker();

  useTickerAnimation({
    containerRef,
    tickerRefs,
    calculateRows,
    isPaused,
  });

  // Event handlers with improved performance using event delegation
  const handleRowClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, _rowIndex: number) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("city-text")) {
        const city = target.getAttribute("data-city") || "";
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

  return (
    <div
      ref={containerRef}
      className="max-w-full mx-auto py-20"
      style={{ minHeight: `${TICKER_CONFIG.MIN_ROW_HEIGHT * availableRows}px` }}
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
                data-city={city}
                onMouseEnter={() => handleCityHover(city)}
              >
                {citiesMetadata[city]?.displayName || city}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
