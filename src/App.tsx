import { COLORS } from "./constants/colors";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [isReturning, setIsReturning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
    setSelectedCity(city);
    setIsReturning(false);
  };

  const handleReturn = () => {
    setIsReturning(true);
    setTimeout(() => {
      setSelectedCity(null);
      setSelectedPosition(null);
      setIsReturning(false);
    }, 1000);
  };

  const marqueeVariants = {
    animate: (direction: number) => ({
      x: direction > 0 ? ["0%", "-50%"] : ["-50%", "0%"],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 120,
          ease: "linear",
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
      top: position?.top || 0,
      left: position?.left || 0,
      x: 0,
      y: 0,
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
            className="inline-flex gap-16"
            variants={marqueeVariants}
            animate="animate"
            custom={1}
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
            className="inline-flex gap-16"
            variants={marqueeVariants}
            animate="animate"
            custom={-1}
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
