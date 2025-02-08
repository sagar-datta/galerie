import { COLORS } from "./constants/colors";
import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

  const createDuplicates = useCallback((arr: string[]) => [...arr, ...arr], []);
  const rowDuplicates = rows.map(createDuplicates);

  // Utility functions
  const getTickerPosition = useCallback((element: HTMLDivElement | null) => {
    if (!element) return 0;
    const transform = window.getComputedStyle(element).transform;
    const matrix = new DOMMatrix(transform);
    return matrix.m41;
  }, []);

  const updateTickerPositions = useCallback(
    (shouldPause: boolean = false) => {
      const containerWidth = containerRef.current?.offsetWidth || 1000;
      const newPositions = rows.map((_, index) => {
        const currentPos = getTickerPosition(tickerRefs.current[index]);
        return {
          current: currentPos,
          target:
            index % 2 === 0
              ? currentPos - containerWidth
              : currentPos + containerWidth,
        };
      });
      setTickerPositions(newPositions);
      setIsPaused(shouldPause);
    },
    [getTickerPosition, rows]
  );

  // Initialize refs and positions
  useEffect(() => {
    tickerRefs.current = Array(rows.length).fill(null);
  }, [rows.length]);

  useEffect(() => {
    if (!selectedCity && rows.length > 0) {
      const containerWidth = containerRef.current?.offsetWidth || 1000;
      const positions = rows.map((_, index) => ({
        current: 0,
        target: index % 2 === 0 ? -containerWidth / 2 : containerWidth / 2,
      }));
      setTickerPositions(positions);
      setIsPaused(false);
    }
  }, [rows.length, selectedCity]);

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

  // Animation variants
  const marqueeVariants = {
    animate: ({
      direction,
      position,
      paused,
    }: {
      direction: number;
      position: { current: number; target: number };
      paused: boolean;
    }) => ({
      x: paused ? position.current : [position.current, position.target],
      transition: {
        x: {
          duration: paused ? 0.3 : 60,
          ease: paused ? "easeInOut" : "linear",
          repeat: paused ? 0 : Infinity,
          repeatType: "loop",
          delay: paused ? 0 : 0.3,
        },
      },
    }),
  };

  const selectedCityVariants = {
    initial: (position: { top: number; left: number } | null) => ({
      top: position?.top || 0,
      left: position?.left || 0,
      x: 0,
      y: 0,
    }),
    animate: {
      top: "50%",
      x: "2rem",
      y: "-50%",
    },
    exit: (position: { top: number; left: number } | null) => ({
      opacity: 1,
      top: position?.top || 0,
      left: position?.left || 0,
      x: 0,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    }),
  };

  // Render
  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.beige }}>
      <AnimatePresence>
        {selectedCity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 w-full h-full z-50"
            style={{ backgroundColor: COLORS.beige }}
          >
            <motion.button
              onClick={handleReturn}
              className="fixed top-4 left-4 px-6 py-3 text-xl font-bold"
              style={{
                backgroundColor: COLORS.dark,
                color: COLORS.beige,
              }}
              whileHover={{
                backgroundColor: "#ff685b",
              }}
            >
              Return
            </motion.button>
            <motion.div
              variants={selectedCityVariants}
              initial="initial"
              animate={isReturning ? "exit" : "animate"}
              custom={selectedPosition}
              className="text-6xl tracking-widest font-bold"
              style={{
                position: "absolute",
                color: COLORS.dark,
                fontFamily: "Helvetica, Arial, sans-serif",
              }}
            >
              {selectedCity}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div ref={containerRef} className="max-w-full mx-auto py-20">
        {rowDuplicates.map((rowDuplicate: string[], rowIndex: number) => (
          <div
            key={rowIndex}
            className={`relative w-full overflow-hidden ${
              rowIndex !== rowDuplicates.length - 1 ? "mb-8" : ""
            }`}
          >
            <motion.div
              ref={(el) => {
                if (tickerRefs.current) {
                  tickerRefs.current[rowIndex] = el;
                }
              }}
              className="inline-flex gap-16"
              variants={marqueeVariants}
              animate="animate"
              custom={{
                direction: rowIndex % 2 === 0 ? 1 : -1,
                position: tickerPositions[rowIndex] || {
                  current: 0,
                  target: 0,
                },
                paused: isPaused,
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
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
