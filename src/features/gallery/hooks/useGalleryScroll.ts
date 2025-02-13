import { useEffect, RefObject } from "react";
import { GalleryImage } from "../types/gallery.types";

interface UseGalleryScrollOptions {
  containerRef: RefObject<HTMLDivElement | null>;
  images: GalleryImage[];
  onImagePreload: (publicId: string, quality: "medium" | "full") => void;
}

/**
 * Hook for managing gallery scroll behavior and dynamic image loading
 * @param options Configuration options including container ref and images
 */
export function useGalleryScroll({
  containerRef,
  images,
  onImagePreload,
}: UseGalleryScrollOptions) {
  // Handle wheel events for horizontal scrolling
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const wheelHandler = (e: WheelEvent) => {
      if (!container) return;
      e.preventDefault();
      if (Math.abs(e.deltaX) > 0) {
        container.scrollLeft += e.deltaX;
        return;
      }
      container.scrollLeft += e.deltaY * 2.5;
    };

    container.addEventListener("wheel", wheelHandler, { passive: false });
    return () => container.removeEventListener("wheel", wheelHandler);
  }, [containerRef]);

  // Handle scroll-based image preloading
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // Find visible images
      const visibleElements = document.elementsFromPoint(
        window.innerWidth / 2,
        window.innerHeight / 2
      );
      const visibleImages = visibleElements.filter((el) =>
        el.classList.contains("gallery-image")
      );

      if (visibleImages.length > 0) {
        const currentVisibleIndex = parseInt(
          visibleImages[visibleImages.length - 1].getAttribute("data-index") ||
            "0"
        );

        // Preload next few images
        const nextImages = images.slice(
          currentVisibleIndex + 1,
          currentVisibleIndex + 4
        );
        nextImages.forEach((image) => {
          onImagePreload(image.publicId, "medium");
        });
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [containerRef, images, onImagePreload]);
}
