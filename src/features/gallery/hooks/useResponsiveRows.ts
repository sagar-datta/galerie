import { useEffect, useState } from "react";
import { WINDOW_HEIGHT_THRESHOLD } from "../constants";

/**
 * Hook for managing responsive row layout based on window height
 * @returns Current number of rows
 */
export function useResponsiveRows() {
  const [numRows, setNumRows] = useState(2);

  useEffect(() => {
    const updateNumRows = () => {
      if (window.innerHeight <= WINDOW_HEIGHT_THRESHOLD) {
        setNumRows(1);
      } else {
        setNumRows(2);
      }
    };

    updateNumRows();
    window.addEventListener("resize", updateNumRows);
    return () => window.removeEventListener("resize", updateNumRows);
  }, []);

  return numRows;
}
