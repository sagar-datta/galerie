import { useEffect, RefObject, MutableRefObject } from "react";

interface UseTickerAnimationProps {
  containerRef: RefObject<HTMLDivElement | null>;
  tickerRefs: MutableRefObject<(HTMLDivElement | null)[]>;
  calculateRows: (containerTop: number) => void;
  isPaused: boolean;
}

export function useTickerAnimation({
  containerRef,
  tickerRefs,
  calculateRows,
  isPaused,
}: UseTickerAnimationProps) {
  useEffect(() => {
    let resizeObserver: ResizeObserver;

    const handleResize = () => {
      if (!containerRef.current) return;
      calculateRows(containerRef.current.getBoundingClientRect().top);

      requestAnimationFrame(() => {
        tickerRefs.current.forEach((ref, index) => {
          if (ref) {
            const isRightToLeft = index % 2 === 0;
            ref.style.animation = "none";
            ref.offsetHeight; // Trigger reflow
            ref.style.animation = `${
              isRightToLeft ? "ticker-right-to-left" : "ticker-left-to-right"
            } 14400s linear infinite ${isRightToLeft ? "normal" : "reverse"}`;
          }
        });
      });
    };

    if (containerRef.current) {
      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(containerRef.current);
      resizeObserver.observe(document.body); // Observe body for footer changes
    }

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial calculation

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [containerRef, tickerRefs, calculateRows]);

  // Handle pausing animations
  useEffect(() => {
    tickerRefs.current.forEach((ref) => {
      if (ref) {
        ref.style.animationPlayState = isPaused ? "paused" : "running";
      }
    });
  }, [isPaused, tickerRefs]);
}
