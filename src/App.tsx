import { COLORS } from "./constants/colors";
import { useState, useCallback } from "react";
import { CitiesTicker } from "./components/CitiesTicker";
import { MainFooter } from "./components/MainFooter";
import { SelectedCity } from "./components/SelectedCity";

function App() {
  // State
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [isReturning, setIsReturning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const updateTickerPositions = useCallback((shouldPause: boolean = false) => {
    setIsPaused(shouldPause);
  }, []);

  // Event handlers
  const handleCityClick = useCallback(
    (city: string, rect: DOMRect) => {
      setSelectedPosition({
        top: rect.top,
        left: rect.left,
      });

      updateTickerPositions(true);
      setSelectedCity(city);
      setIsReturning(false);
    },
    [updateTickerPositions]
  );

  const handleReturn = useCallback(() => {
    setIsReturning(true);

    // Wait for the return animation to complete
    setTimeout(() => {
      setSelectedCity(null);
      setSelectedPosition(null);
      setIsReturning(false);

      // Brief delay before resuming ticker to ensure smooth transition
      requestAnimationFrame(() => {
        updateTickerPositions(false);
      });
    }, 350); // Slightly longer than the animation duration (300ms) to ensure completion
  }, [updateTickerPositions]);

  return (
    <div
      className="grid h-screen grid-rows-[1fr_auto] overflow-hidden"
      style={{ backgroundColor: COLORS.beige }}
    >
      {selectedCity && selectedPosition && (
        <SelectedCity
          city={selectedCity}
          position={selectedPosition}
          onReturn={handleReturn}
          isReturning={isReturning}
        />
      )}
      <div className="relative overflow-hidden">
        <CitiesTicker onCityClick={handleCityClick} isPaused={isPaused} />
      </div>
      <MainFooter isCitySelected={!!selectedCity} />
    </div>
  );
}

export default App;
