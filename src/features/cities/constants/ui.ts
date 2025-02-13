import { COLORS } from "../../../constants/colors";

// Animation constants
export const ANIMATION_CONFIG = {
  defaultDuration: "0.5s",
  quickDuration: "0.3s",
  timing: {
    ease: "ease-in-out",
    bezier: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
} as const;

// Component styles
export const selectedCityStyles = {
  container: {
    backgroundColor: COLORS.beige,
  },
  returnButton: {
    backgroundColor: COLORS.dark,
    color: COLORS.beige,
  },
  galleryContainer: {
    opacity: 1,
    transition: "opacity 0.5s ease",
    overflow: "hidden",
  },
  footer: {
    backgroundColor: COLORS.coral,
  },
  footerText: {
    color: COLORS.dark,
    transition:
      "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease-in-out",
    fontSize: "clamp(1.25rem,4vh,2.5rem)",
    lineHeight: "1.3",
    fontWeight: 600,
    letterSpacing: "0.08em",
  },
  cityText: {
    fontFamily: "Helvetica, Arial, sans-serif",
    zIndex: 40,
  },
};

// Ticker styles and animations
export const tickerAnimations = {
  duration: "14400s",
  timing: "linear",
  iterations: "infinite",
} as const;
