import { COLORS } from "./constants/colors";
import { useState, useRef, useCallback, useEffect, useMemo } from "react";

function App() {
  // State
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [isReturning, setIsReturning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasReturned, setHasReturned] = useState(false);
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

  // Duplicates 3 times.
  // For even rows (right to left), duplicate to the right (append).
  // For odd rows (left to right), duplicate to the left (prepend).
  const createDuplicates = useCallback((arr: string[], rowIndex: number) => {
    let duplicatedArr = [...arr];
    for (let i = 0; i < 99; i++) {
      // repeat 99 more times, for a total of 100
      duplicatedArr = [...duplicatedArr, ...arr];
    }
    return duplicatedArr;
  }, []);
  const rowDuplicates = useMemo(() => {
    // Memoize rowDuplicates
    return rows.map(createDuplicates);
  }, [rows, createDuplicates]); // Dependencies: rows, createDuplicates

  const updateTickerPositions = useCallback((shouldPause: boolean = false) => {
    setIsPaused(shouldPause);
  }, []);

  const animateSelectedCityIn = useCallback(() => {
    const selectedCityElement = document.getElementById(
      "selected-city-element"
    );
    if (selectedCityElement && selectedPosition) {
      selectedCityElement.style.transition =
        "top 0.5s ease-in-out, left 0.5s ease-in-out, transform 0.5s ease-in-out, opacity 0.5s ease-in-out";
      selectedCityElement.style.top = "50%";
      selectedCityElement.style.left = "2rem";
      selectedCityElement.style.transform = "translateY(-50%)";
    }
  }, [selectedPosition]);

  const animateSelectedCityOut = useCallback(
    (position: { top: number; left: number } | null) => {
      const selectedCityElement = document.getElementById(
        "selected-city-element"
      );
      if (selectedCityElement && position) {
        selectedCityElement.style.transition =
          "top 0.3s ease-in-out, left 0.3s ease-in-out, transform 0.3s ease-in-out, opacity 0.3s ease-in-out";
        selectedCityElement.style.top = `${position.top}px`;
        selectedCityElement.style.left = `${position.left}px`;
        selectedCityElement.style.transform = "translateY(0%) translateX(0%)";
        selectedCityElement.style.opacity = "0";
      }
    },
    []
  );

  useEffect(() => {
    if (selectedCity && selectedPosition) {
      animateSelectedCityIn();
    }
  }, [selectedCity, selectedPosition, animateSelectedCityIn]);

  useEffect(() => {
    if (isReturning && selectedPosition) {
      animateSelectedCityOut(selectedPosition);
    }
  }, [isReturning, selectedPosition, animateSelectedCityOut]);

  // Event handlers
  const handleCityClick = useCallback(
    (city: string, e: React.MouseEvent<HTMLSpanElement>, rowIndex: number) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setSelectedPosition({
        top: rect.top,
        left: rect.left,
      });

      updateTickerPositions(true);
      setHasReturned(false);
      setSelectedCity(city);
      setIsReturning(false);
    },
    [updateTickerPositions]
  );

  const handleReturn = useCallback(() => {
    setIsReturning(true);
  }, []);

  // Return animation effect
  useEffect(() => {
    if (isReturning && !hasReturned) {
      const timer1 = setTimeout(() => {
        setHasReturned(true);
        setSelectedCity(null);
        animateSelectedCityOut(selectedPosition); // Animate out
        setSelectedPosition(null);
        setIsReturning(false);

        const timer2 = setTimeout(() => {
          updateTickerPositions(false);
        }, 200);

        return () => clearTimeout(timer2);
      }, 300);

      return () => clearTimeout(timer1);
    }
  }, [isReturning, hasReturned, updateTickerPositions]);

  // Render
  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.beige }}>
      {selectedCity && (
        <div
          className="fixed top-0 left-0 w-full h-full z-50"
          style={{ backgroundColor: COLORS.beige }}
        >
          <button
            onClick={handleReturn}
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
              top: `${selectedPosition?.top}px`, // SET INITIAL TOP
              left: `${selectedPosition?.left}px`, // SET INITIAL LEFT
              color: COLORS.dark,
              fontFamily: "Helvetica, Arial, sans-serif",
            }}
            id="selected-city-element" // ADD ID FOR JS MANIPULATION
          >
            {selectedCity}
          </div>
        </div>
      )}
      <div ref={containerRef} className="max-w-full mx-auto py-20">
        {rowDuplicates.map((rowDuplicate: string[], rowIndex: number) => (
          <div
            key={rowIndex}
            className={`relative w-full overflow-hidden ${
              rowIndex !== rowDuplicates.length - 1 ? "mb-8" : ""
            }`}
          >
            <div // Ticker Row Container
              ref={(el) => {
                tickerRefs.current[rowIndex] = el;
              }}
              className={`ticker-row inline-flex gap-16 ${
                isPaused ? "paused" : ""
              }`}
              style={{
                // ADD INLINE STYLE HERE
                transform: `translateX(${rowIndex % 2 === 0 ? "0%" : "-80%"})`, // Even rows start at 0%, odd rows start at -80%
                animationName:
                  rowIndex % 2 === 0
                    ? "ticker-right-to-left"
                    : "ticker-left-to-right", // Different animations for each direction
                animationDirection: rowIndex % 2 === 0 ? "normal" : "reverse", // Only reverse for odd rows
              }}
            >
              {/* REMOVE even and odd classes from className
                 className={`ticker-row inline-flex gap-16 ${
                rowIndex % 2 === 0 ? "even" : "odd" */}
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
    </div>
  );
}

export default App;
