import { COLORS } from "./constants/colors";
import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [isReturning, setIsReturning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasReturned, setHasReturned] = useState(false);
  const [tickerPositions, setTickerPositions] = useState<{
    top: { current: number; target: number };
    bottom: { current: number; target: number };
  }>({
    top: { current: 0, target: -1000 },
    bottom: { current: 0, target: 1000 },
  });

  // Initialize animation positions on mount
  useEffect(() => {
    const containerWidth = containerRef.current?.offsetWidth || 1000;
    setTickerPositions({
      top: {
        current: 0,
        target: -containerWidth / 2,
      },
      bottom: {
        current: 0,
        target: containerWidth / 2,
      },
    });
  }, []);
  const containerRef = useRef<HTMLDivElement>(null);
  const topTickerRef = useRef<HTMLDivElement>(null);
  const bottomTickerRef = useRef<HTMLDivElement>(null);

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

  // Split cities into two groups
  const midPoint = Math.ceil(cities.length / 2);
  const topCities = cities.slice(0, midPoint);
  const bottomCities = cities.slice(midPoint);

  // Create duplicated arrays - using only 2 copies for better performance
  const createDuplicates = (arr: string[]) => [...arr, ...arr];
  const topDuplicates = createDuplicates(topCities);
  const bottomDuplicates = createDuplicates(bottomCities);

  const handleCityClick = (
    city: string,
    e: React.MouseEvent<HTMLSpanElement>
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSelectedPosition({
      top: rect.top,
      left: rect.left,
    });
    // Store current ticker positions and calculate targets
    const topPos = getTickerPosition(topTickerRef.current);
    const bottomPos = getTickerPosition(bottomTickerRef.current);
    const containerWidth = containerRef.current?.offsetWidth || 1000;

    setTickerPositions({
      top: {
        current: topPos,
        target: topPos - containerWidth / 2,
      },
      bottom: {
        current: bottomPos,
        target: bottomPos + containerWidth / 2,
      },
    });
    setIsPaused(true);
    setHasReturned(false);
    setSelectedCity(city);
    setIsReturning(false);
  };

  const handleReturn = () => {
    setIsReturning(true);
  };

  // Effect to handle the completion of return animation
  useEffect(() => {
    if (isReturning && !hasReturned) {
      // Wait for city to complete return animation
      setTimeout(() => {
        setHasReturned(true);
        setSelectedCity(null);
        setSelectedPosition(null);
        setIsReturning(false);
        // Wait a bit longer before resuming ticker to ensure perfect alignment
        setTimeout(() => {
          // Get fresh positions and calculate targets
          const topPos = getTickerPosition(topTickerRef.current);
          const bottomPos = getTickerPosition(bottomTickerRef.current);
          const containerWidth = containerRef.current?.offsetWidth || 1000;

          setTickerPositions({
            top: {
              current: topPos,
              target: topPos - containerWidth / 2,
            },
            bottom: {
              current: bottomPos,
              target: bottomPos + containerWidth / 2,
            },
          });
          setIsPaused(false);
        }, 200);
      }, 300);
    }
  }, [isReturning, hasReturned]);

  const marqueeVariants = {
    animate: ({
      direction,
      position,
      paused,
    }: {
      direction: number;
      position: { current: number; target: number };
      paused: boolean;
    }) => {
      return {
        x: paused ? position.current : [position.current, position.target],
        transition: {
          x: paused
            ? { duration: 0 }
            : {
                repeat: Infinity,
                repeatType: "loop",
                duration: 60,
                ease: "linear",
              },
        },
      };
    },
  };

  const getTickerPosition = useCallback((element: HTMLDivElement | null) => {
    if (!element) return 0;
    const transform = window.getComputedStyle(element).transform;
    const matrix = new DOMMatrix(transform);
    return matrix.m41; // Get X transform value
  }, []);

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
        <div className="relative w-full overflow-hidden mb-8">
          <motion.div
            ref={topTickerRef}
            className="inline-flex gap-16"
            variants={marqueeVariants}
            animate="animate"
            custom={{
              direction: 1,
              position: {
                current: tickerPositions.top.current,
                target: tickerPositions.top.target,
              },
              paused: isPaused,
            }}
          >
            {topDuplicates.map((city, index) => (
              <motion.span
                key={`${city}-${index}`}
                className="text-6xl tracking-widest font-bold cursor-pointer flex-shrink-0"
                style={{
                  color: COLORS.dark,
                  fontFamily: "Helvetica, Arial, sans-serif",
                }}
                onClick={(e) => handleCityClick(city, e)}
                whileHover={{ color: "#ff685b" }}
              >
                {city}
              </motion.span>
            ))}
          </motion.div>
        </div>
        <div className="relative w-full overflow-hidden">
          <motion.div
            ref={bottomTickerRef}
            className="inline-flex gap-16"
            variants={marqueeVariants}
            animate="animate"
            custom={{
              direction: -1,
              position: {
                current: tickerPositions.bottom.current,
                target: tickerPositions.bottom.target,
              },
              paused: isPaused,
            }}
          >
            {bottomDuplicates.map((city, index) => (
              <motion.span
                key={`${city}-${index}`}
                className="text-6xl tracking-widest font-bold cursor-pointer flex-shrink-0"
                style={{
                  color: COLORS.dark,
                  fontFamily: "Helvetica, Arial, sans-serif",
                }}
                onClick={(e) => handleCityClick(city, e)}
                whileHover={{ color: "#ff685b" }}
              >
                {city}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default App;
