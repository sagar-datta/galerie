export const COLORS = {
  beige: "#EBE9D1",
  dark: "#131313",
  white: "#FFF",
  red: "#FF3420",
  coral: "#FF685B",
  black: "#000",
} as const;

// Type for accessing colors
export type ColorKey = keyof typeof COLORS;
