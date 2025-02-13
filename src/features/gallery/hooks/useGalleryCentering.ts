import { useCallback, useEffect, RefObject } from "react";

interface UseGalleryCenteringOptions {
  containerRef: RefObject<HTMLDivElement | null>;
  onCenteringChange: (shouldCenter: boolean) => void;
}

/**
 * Hook for managing gallery centering behavior based on container width
 * @param options Configuration options including container ref and callback
 */
export function useGalleryCentering({
  containerRef,
  onCenteringChange,
}: UseGalleryCenteringOptions) {
  const checkIfShouldCenter = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const shouldCenterNew = container.scrollWidth <= container.clientWidth;
    onCenteringChange(shouldCenterNew);
  }, [containerRef, onCenteringChange]);

  useEffect(() => {
    const observer = new ResizeObserver(checkIfShouldCenter);
    const container = containerRef.current;
    if (container) {
      observer.observe(container);
    }
    return () => {
      if (container) {
        observer.unobserve(container);
      }
      observer.disconnect();
    };
  }, [checkIfShouldCenter, containerRef]);

  useEffect(() => {
    window.addEventListener("resize", checkIfShouldCenter);
    return () => window.removeEventListener("resize", checkIfShouldCenter);
  }, [checkIfShouldCenter]);

  return { checkIfShouldCenter };
}
