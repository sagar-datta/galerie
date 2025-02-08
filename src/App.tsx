import { COLORS } from "./constants/colors";
import { useState, useRef, useCallback, useEffect } from "react";

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
  const [tickerPositions, setTickerPositions] = useState<
    Array<{
      current: number;
      target: number;
    }>
  >([]);

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
  const rows: string[][] = [];
  for (let i = 0; i < cities.length; i += rowSize) {
    rows.push(cities.slice(i, i + rowSize));
  }

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
  const rowDuplicates = rows.map(createDuplicates);

  const updateTickerPositions = useCallback(
    (shouldPause: boolean = false) => {
      const containerWidth = containerRef.current?.offsetWidth || 1000;
      const newPositions = rows
        .map((_, index) => {
          const currentPos = tickerPositions[index]?.current || 0; // Use existing current position
          return {
            current: currentPos,
            target:
              index % 2 === 0
                ? currentPos - containerWidth * 2 // Modified target position
                : currentPos + containerWidth * 2, // Modified target position
          };
        })
        .map((pos) => ({
          current: pos.current,
          target: Math.round(pos.target),
        })); // Round target
      setTickerPositions(newPositions);
      setIsPaused(shouldPause);
    },
    [rows, tickerPositions]
  );

  // Initialize refs and positions
  useEffect(() => {
    tickerRefs.current = Array(rows.length).fill(null);
  }, [rows.length]);

  useEffect(() => {
    if (!selectedCity && rows.length > 0) {
      const containerWidth = containerRef.current?.offsetWidth || 1000;
      const positions = rows.map((_, index) => ({
        current: index % 2 !== 0 ? -containerWidth : 0, // Shift current position for odd rows
        target: index % 2 === 0 ? -containerWidth * 2 : containerWidth * 2,
      }));
      setTickerPositions(positions);
      setIsPaused(false);
    }
  }, [rows.length, selectedCity]);

    const animateSelectedCityIn = useCallback(() => {
    const selectedCityElement = document.getElementById("selected-city-element");
    if (selectedCityElement && selectedPosition) {
      selectedCityElement.style.transition = 'top 0.5s ease-in-out, left 0.5s ease-in-out, transform 0.5s ease-in-out, opacity 0.5s ease-in-out';
      selectedCityElement.style.top = '50%';
      selectedCityElement.style.left = '2rem';
      selectedCityElement.style.transform = 'translateY(-50%)';
    }
  }, [selectedPosition]);

  const animateSelectedCityOut = useCallback((position: { top: number, left: number } | null) => {
    const selectedCityElement = document.getElementById("selected-city-element");
    if (selectedCityElement && position) {
      selectedCityElement.style.transition = 'top 0.3s ease-in-out, left 0.3s ease-in-out, transform 0.3s ease-in-out, opacity 0.3s ease-in-out';
      selectedCityElement.style.top = `${position.top}px`;
      selectedCityElement.style.left = `${position.left}px`;
      selectedCityElement.style.transform = 'translateY(0%) translateX(0%)';
      selectedCityElement.style.opacity = '0';
    }
  }, []);

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
            // variants={selectedCityVariants} // REMOVE THIS LINE
            // initial="initial" // REMOVE THIS LINE
            // animate={isReturning ? "exit" : "animate"} // REMOVE THIS LINE
            // custom={selectedPosition} // REMOVE THIS LINE
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
            <div
              ref={(el) => {
                  tickerRefs.current[rowIndex] = el;
              }}
              className="inline-flex gap-16"
              style={{ // ADD STYLE HERE TO CONTROL ANIMATION
                transform: `translateX(${tickerPositions[rowIndex]?.current || 0}px)`,
                transition: isPaused ? 'none' : 'transform 150s linear',
              }}
            >
              {rowDuplicate.map((city: string, index: number) => (
                <motion.span
                  key={`${city}-${index}`}
                  className="text-6xl tracking-widest font-bold cursor-pointer flex-shrink-0"
                  style={{
                    color: COLORS.dark,
                    fontFamily: "Helvetica, Arial, sans-serif",
                  }}
                  onClick={(e) => handleCityClick(city, e, rowIndex)}
                  whileHover={{ color: "#ff685b" }}
                >
                  {city}
                </motion.span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
