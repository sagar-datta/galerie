import { COLORS } from "./constants/colors";
import { useState, useCallback, useEffect, useRef } from "react";
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

  // Refs for cleanup - initialized with undefined
  const returnTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  const animationFrameRef = useRef<number | undefined>(undefined);

  const updateTickerPositions = useCallback((shouldPause: boolean = false) => {
    setIsPaused(shouldPause);
  }, []);

  // Event handlers
  const handleCityClick = useCallback(
    (city: string, rect: DOMRect) => {
      // Batch state updates for better performance
      requestAnimationFrame(() => {
        setSelectedPosition({
          top: rect.top,
          left: rect.left,
        });
        setSelectedCity(city);
        updateTickerPositions(true);
      });
      setIsReturning(false);
    },
    [updateTickerPositions]
  );

  const handleReturn = useCallback(() => {
    setIsReturning(true);

    // Clear any existing timeouts/animation frames
    if (returnTimeoutRef.current) {
      clearTimeout(returnTimeoutRef.current);
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Set new timeout
    returnTimeoutRef.current = setTimeout(() => {
      // Batch state updates
      requestAnimationFrame(() => {
        setSelectedCity(null);
        setSelectedPosition(null);
        setIsReturning(false);

        // Schedule ticker resumption
        animationFrameRef.current = requestAnimationFrame(() => {
          updateTickerPositions(false);
        });
      });
    }, 350);
  }, [updateTickerPositions]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (returnTimeoutRef.current) {
        clearTimeout(returnTimeoutRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

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
