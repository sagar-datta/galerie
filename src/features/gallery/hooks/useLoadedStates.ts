import { useCallback, useState } from "react";

type LoadState = Record<string, number>;

/**
 * Hook for managing image loading states in the gallery
 * @returns Object containing loaded states and handler function
 */
export function useLoadedStates() {
  const [loadedStates, setLoadedStates] = useState<LoadState>({});

  const handleImageLoad = useCallback(
    (imageId: string, quality: "medium" | "full") => {
      setLoadedStates((prev) => ({
        ...prev,
        [imageId]: quality === "medium" ? 1 : 2,
      }));
    },
    []
  );

  return { loadedStates, handleImageLoad };
}
