import { COLORS } from "./constants/colors";
import { useState, useCallback, useEffect } from "react";
import { CitiesTicker } from "./components/CitiesTicker";

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
    (city: string, rect: DOMRect) => {
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
        animateSelectedCityOut(selectedPosition);
        setSelectedPosition(null);
        setIsReturning(false);

        const timer2 = setTimeout(() => {
          updateTickerPositions(false);
        }, 200);

        return () => clearTimeout(timer2);
      }, 300);

      return () => clearTimeout(timer1);
    }
  }, [
    isReturning,
    hasReturned,
    selectedPosition,
    animateSelectedCityOut,
    updateTickerPositions,
  ]);

  return (
    <div
      className="grid min-h-screen grid-rows-[3fr_1fr] overflow-hidden"
      style={{ backgroundColor: COLORS.beige }}
    >
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
              top: `${selectedPosition?.top}px`,
              left: `${selectedPosition?.left}px`,
              color: COLORS.dark,
              fontFamily: "Helvetica, Arial, sans-serif",
            }}
            id="selected-city-element"
          >
            {selectedCity}
          </div>
        </div>
      )}
      <div className="relative overflow-hidden">
        <CitiesTicker onCityClick={handleCityClick} isPaused={isPaused} />
      </div>
      <div
        className="flex items-center px-8 overflow-hidden"
        style={{ backgroundColor: COLORS.coral }}
      >
        <span
          className="text-6xl font-bold tracking-widest"
          style={{ color: COLORS.beige }}
        >
          SAGAR
        </span>
      </div>
    </div>
  );
}

export default App;
