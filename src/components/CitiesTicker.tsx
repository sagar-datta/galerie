import { useRef, useCallback, useMemo } from "react";
import { COLORS } from "../constants/colors";

interface CitiesTickerProps {
  onCityClick: (city: string, rect: DOMRect) => void;
  isPaused: boolean;
}

export function CitiesTicker({ onCityClick, isPaused }: CitiesTickerProps) {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const tickerRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Constants
  const cities = [
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

  const rowSize = 4;
  const rows: string[][] = useMemo(() => {
    // Memoize rows
    const calculatedRows: string[][] = [];
    for (let i = 0; i < cities.length; i += rowSize) {
      calculatedRows.push(cities.slice(i, i + rowSize));
    }
    return calculatedRows;
  }, [cities, rowSize]); // Dependencies: cities, rowSize (though these are constants here)

  // Create duplicates for infinite scroll
  const createDuplicates = useCallback((arr: string[], rowIndex: number) => {
    let duplicatedArr = [...arr];
    for (let i = 0; i < 4; i++) {
      // Only need ~5 copies for smooth infinite scroll
      duplicatedArr = [...duplicatedArr, ...arr];
    }
    return duplicatedArr;
  }, []);

  const rowDuplicates = useMemo(() => {
    // Memoize rowDuplicates
    return rows.map(createDuplicates);
  }, [rows, createDuplicates]); // Dependencies: rows, createDuplicates

  // Event handlers
  const handleCityClick = useCallback(
    (city: string, e: React.MouseEvent<HTMLSpanElement>, rowIndex: number) => {
      const rect = e.currentTarget.getBoundingClientRect();
      onCityClick(city, rect);
    },
    [onCityClick]
  );

  return (
    <div ref={containerRef} className="max-w-full mx-auto py-20">
      {rowDuplicates.map((rowDuplicate: string[], rowIndex: number) => (
        <div
          key={rowIndex}
          className={`relative w-full overflow-hidden ${
            rowIndex !== rowDuplicates.length - 1 ? "mb-8" : ""
          }`}
        >
          <div
            ref={(el) => {
              tickerRefs.current[rowIndex] = el;
            }}
            className={`ticker-row inline-flex gap-16 ${
              isPaused ? "paused" : ""
            }`}
            style={{
              transform: `translateX(${rowIndex % 2 === 0 ? "0%" : "-80%"})`,
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
                onClick={(e) => handleCityClick(city, e, rowIndex)}
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
