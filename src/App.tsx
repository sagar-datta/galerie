import { COLORS } from "./constants/colors";
import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { CitiesTicker } from "./components/CitiesTicker";
import { MainFooter } from "./components/MainFooter";
import { SelectedCity } from "./components/SelectedCity";
import {
  HashRouter,
  Routes,
  Route,
  useParams,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { cityGalleries } from "./data/images";

// URL formatting utility
const formatCityUrl = (city: string) => city.toLowerCase().replace(/\s+/g, "-");
const normalizeCityName = (cityUrl: string) => cityUrl.replace(/-/g, " ");

// Main App wrapper with router
function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/:cityName" element={<MainApp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

// Main application component
function MainApp() {
  const { cityName } = useParams();
  const navigate = useNavigate();

  // Batch state updates using a single state object
  const [state, setState] = useState({
    selectedCity: null as string | null,
    selectedPosition: null as { top: number; left: number } | null,
    isReturning: false,
    isPaused: false,
    isDirectAccess: true,
  });

  // Refs for cleanup and animation with proper initialization
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Handle URL-based city selection
  useEffect(() => {
    if (cityName && state.isDirectAccess) {
      const validCity = Object.keys(cityGalleries).find(
        (key) => key.toUpperCase() === normalizeCityName(cityName).toUpperCase()
      );
      if (validCity) {
        setState((prev) => ({
          ...prev,
          selectedCity: validCity.toUpperCase(),
          selectedPosition: {
            top: window.innerHeight * 0.9166,
            left: window.innerWidth / 2,
          },
          isPaused: true,
        }));
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [cityName, navigate, state.isDirectAccess]);

  // Event handlers
  const handleCityClick = useCallback(
    (city: string, rect: DOMRect) => {
      navigate(`/${formatCityUrl(city)}`);
      setState((prev) => ({
        ...prev,
        selectedCity: city.toUpperCase(),
        selectedPosition: {
          top: rect.top,
          left: rect.left,
        },
        isPaused: true,
        isDirectAccess: false,
        isReturning: false,
      }));
    },
    [navigate]
  );

  const handleReturn = useCallback(() => {
    setState((prev) => ({ ...prev, isReturning: true }));
    navigate("/");

    // Clear existing timeouts/animations
    timeoutRef.current && clearTimeout(timeoutRef.current);
    animationFrameRef.current &&
      cancelAnimationFrame(animationFrameRef.current);

    // Set new timeout for cleanup
    timeoutRef.current = setTimeout(() => {
      setState((prev) => ({
        ...prev,
        selectedCity: null,
        selectedPosition: null,
        isReturning: false,
        isPaused: false,
        isDirectAccess: true,
      }));
    }, 350);
  }, [navigate]);

  // Cleanup on unmount
  // Update document title when city changes
  // Memoize the formatted city name to prevent unnecessary recalculations
  const formattedCity = useMemo(() => {
    if (!state.selectedCity) return null;
    return state.selectedCity
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }, [state.selectedCity]);

  // Update document title when formatted city changes
  useEffect(() => {
    document.title = formattedCity
      ? `Galerie de Sagar - ${formattedCity}`
      : "Galerie de Sagar";
  }, [formattedCity]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      timeoutRef.current && clearTimeout(timeoutRef.current);
      animationFrameRef.current &&
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <div
      className="grid h-screen grid-rows-[1fr_auto] overflow-hidden"
      style={{ backgroundColor: COLORS.beige }}
    >
      {state.selectedCity && state.selectedPosition && (
        <SelectedCity
          city={state.selectedCity}
          position={state.selectedPosition}
          onReturn={handleReturn}
          isReturning={state.isReturning}
          isDirectAccess={state.isDirectAccess}
        />
      )}
      <div className="relative overflow-hidden">
        <CitiesTicker onCityClick={handleCityClick} isPaused={state.isPaused} />
      </div>
      <MainFooter isCitySelected={!!state.selectedCity} />
    </div>
  );
}

export default App;
