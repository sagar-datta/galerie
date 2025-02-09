import { COLORS } from "./constants/colors";
import { useState, useCallback, useEffect, useRef } from "react";
import { CitiesTicker } from "./components/CitiesTicker";
import { MainFooter } from "./components/MainFooter";
import { SelectedCity } from "./components/SelectedCity";
import {
  BrowserRouter,
  Routes,
  Route,
  useParams,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { cityGalleries } from "./data/images";

// Main App wrapper with router
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/city/:cityName" element={<MainApp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// Main application component
function MainApp() {
  // URL params and navigation
  const { cityName } = useParams();
  const navigate = useNavigate();

  // State
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [isReturning, setIsReturning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isDirectAccess, setIsDirectAccess] = useState(true);

  // Refs for cleanup
  const returnTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  const animationFrameRef = useRef<number | undefined>(undefined);

  const updateTickerPositions = useCallback((shouldPause: boolean = false) => {
    setIsPaused(shouldPause);
  }, []);

  // Handle URL-based city selection
  useEffect(() => {
    if (cityName && isDirectAccess) {
      const validCity = Object.keys(cityGalleries).find(
        (key) => key.toUpperCase() === cityName.toUpperCase()
      );
      if (validCity) {
        setSelectedCity(validCity.toUpperCase());
        // For direct access, position is centered vertically and horizontally
        setSelectedPosition({
          top: window.innerHeight * 0.9166, // 91.66% of viewport height
          left: window.innerWidth / 2,
        });
        updateTickerPositions(true);
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [cityName, navigate, updateTickerPositions, isDirectAccess]);

  // Event handlers
  const handleCityClick = useCallback(
    (city: string, rect: DOMRect) => {
      // Update URL (lowercase for URLs) but keep display name uppercase
      navigate(`/city/${city.toLowerCase()}`);
      setIsDirectAccess(false);

      // Batch state updates for better performance
      requestAnimationFrame(() => {
        setSelectedPosition({
          top: rect.top,
          left: rect.left,
        });
        setSelectedCity(city.toUpperCase()); // Ensure uppercase for display
        updateTickerPositions(true);
      });
      setIsReturning(false);
    },
    [updateTickerPositions, navigate]
  );

  const handleReturn = useCallback(() => {
    setIsReturning(true);
    navigate("/");

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
        setIsDirectAccess(true);

        // Schedule ticker resumption
        animationFrameRef.current = requestAnimationFrame(() => {
          updateTickerPositions(false);
        });
      });
    }, 350);
  }, [updateTickerPositions, navigate]);

  // Reset animation state when unmounting selected city
  useEffect(() => {
    if (!selectedCity && isPaused) {
      updateTickerPositions(false);
    }
  }, [selectedCity, isPaused, updateTickerPositions]);

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
          isDirectAccess={isDirectAccess}
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
