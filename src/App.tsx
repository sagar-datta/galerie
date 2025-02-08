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
  const [hasReturned, setHasReturned] = useState(false);

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
      setHasReturned(false);
      setSelectedCity(city);
      setIsReturning(false);
    },
    [updateTickerPositions]
  );

  const handleReturn = useCallback(() => {
    setIsReturning(true);

    // Return animation timing
    setTimeout(() => {
      setHasReturned(true);
      setSelectedCity(null);
      setSelectedPosition(null);
      setIsReturning(false);

      setTimeout(() => {
        updateTickerPositions(false);
      }, 200);
    }, 300);
  }, [updateTickerPositions]);

  return (
    <div
      className="grid h-screen grid-rows-[3fr_1fr] overflow-hidden"
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
      <MainFooter />
    </div>
  );
}

export default App;
