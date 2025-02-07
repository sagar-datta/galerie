import { COLORS } from "./constants/colors";
import { useState, useRef } from "react";

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
    if (containerRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      setSelectedPosition({
        top: rect.top,
        left: rect.left,
      });
      setSelectedCity(city);
      setIsReturning(false);

      containerRef.current.classList.add("paused");
    }
  };

  const handleReturn = () => {
    setIsReturning(true);
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.classList.remove("paused");
      }
      setSelectedCity(null);
      setSelectedPosition(null);
      setIsReturning(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.beige }}>
      {selectedCity && (
        <div
          className="fixed top-0 left-0 w-full h-full z-50"
          style={{ backgroundColor: COLORS.beige }}
        >
          <button
            onClick={handleReturn}
            className="fixed top-4 left-4 px-6 py-3 text-xl font-bold transition-colors"
            style={{
              backgroundColor: COLORS.dark,
              color: COLORS.beige,
            }}
          >
            Return
          </button>
          <div
            className={`selected-city text-6xl tracking-widest font-bold ${
              isReturning ? "returning" : ""
            }`}
            style={{
              position: "absolute",
              top: selectedPosition?.top,
              left: selectedPosition?.left,
              color: COLORS.dark,
              fontFamily: "Helvetica, Arial, sans-serif",
            }}
          >
            {selectedCity}
          </div>
        </div>
      )}
      <div
        ref={containerRef}
        className="max-w-full mx-auto py-20 content-visibility-auto"
      >
        <div className="ticker-row mb-8 scroll-left">
          <div className="ticker-content">
            {topDuplicates.map((city, index) => (
              <span
                key={`${city}-${index}`}
                className="ticker-item text-6xl tracking-widest font-bold cursor-pointer"
                style={{
                  color: COLORS.dark,
                  fontFamily: "Helvetica, Arial, sans-serif",
                }}
                onClick={(e) => handleCityClick(city, e)}
              >
                {city}
              </span>
            ))}
          </div>
        </div>
        <div className="ticker-row scroll-right">
          <div className="ticker-content">
            {bottomDuplicates.map((city, index) => (
              <span
                key={`${city}-${index}`}
                className="ticker-item text-6xl tracking-widest font-bold cursor-pointer"
                style={{
                  color: COLORS.dark,
                  fontFamily: "Helvetica, Arial, sans-serif",
                }}
                onClick={(e) => handleCityClick(city, e)}
              >
                {city}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
