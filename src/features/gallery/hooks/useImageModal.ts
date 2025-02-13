import { useState, useCallback, useEffect, useMemo } from "react";
import { GalleryImage } from "../types/gallery.types";
import { getGoogleMapsUrl } from "../../../services/maps";
import { calculateCursorStyle } from "../utils/layout";

interface UseImageModalOptions {
  image: GalleryImage | null;
  city: string;
}

interface UseImageModalReturn {
  isFullscreen: boolean;
  cursorStyle: { cursor: string };
  mapsUrl: string | null;
  toggleFullscreen: () => void;
}

/**
 * Hook for managing image modal state and functionality
 * @param options Configuration options including current image and city
 * @returns Object containing modal state and handlers
 */
export function useImageModal({
  image,
  city,
}: UseImageModalOptions): UseImageModalReturn {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Reset fullscreen when image changes
  useEffect(() => {
    setIsFullscreen(false);
  }, [image]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  const cursorStyle = useMemo(() => calculateCursorStyle(city), [city]);

  const mapsUrl = useMemo(() => {
    if (!image?.metadata?.gpsLatitude || !image?.metadata?.gpsLongitude) {
      return null;
    }
    return getGoogleMapsUrl(
      image.metadata.gpsLatitude,
      image.metadata.gpsLongitude
    );
  }, [image?.metadata?.gpsLatitude, image?.metadata?.gpsLongitude]);

  return {
    isFullscreen,
    cursorStyle,
    mapsUrl,
    toggleFullscreen,
  };
}
