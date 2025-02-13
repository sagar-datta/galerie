import { useCallback, useState, useMemo } from "react";
import { CITIES, TICKER_CONFIG } from "../constants/ticker";

export function useResponsiveTicker() {
  const [availableRows, setAvailableRows] = useState(3); // Default to 3 rows

  const calculateRows = useCallback((containerTop: number) => {
    // Calculate available vertical space
    const availableSpace =
      window.innerHeight -
      containerTop -
      TICKER_CONFIG.BOTTOM_MARGIN -
      TICKER_CONFIG.SAFETY_BUFFER;

    const SPACE_PER_ROW =
      TICKER_CONFIG.MIN_ROW_HEIGHT + TICKER_CONFIG.ROW_MARGIN;

    // Calculate and set optimal number of rows
    const maxRows = Math.max(
      1,
      Math.min(3, Math.floor(availableSpace / SPACE_PER_ROW))
    );
    setAvailableRows(maxRows);
  }, []);

  // Create dynamic rows based on available space
  const rows = useMemo(() => {
    const citiesPerRow = Math.ceil(CITIES.length / availableRows);
    const calculatedRows: string[][] = [];

    for (let i = 0; i < CITIES.length; i += citiesPerRow) {
      calculatedRows.push(CITIES.slice(i, i + citiesPerRow));
    }

    return calculatedRows;
  }, [availableRows]);

  // Create duplicates for infinite scroll
  const createDuplicates = useCallback((arr: string[]) => {
    let duplicatedArr = [...arr];
    for (let i = 0; i < TICKER_CONFIG.DUPLICATE_COUNT; i++) {
      duplicatedArr = [...duplicatedArr, ...arr];
    }
    return duplicatedArr;
  }, []);

  const rowDuplicates = useMemo(() => {
    return rows.map(createDuplicates);
  }, [rows, createDuplicates]);

  return {
    availableRows,
    calculateRows,
    rowDuplicates,
  };
}
