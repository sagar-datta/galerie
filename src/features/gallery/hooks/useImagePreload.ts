import { useCallback, useEffect } from "react";
import { GalleryImage } from "../types/gallery.types";
import { getCloudinaryUrl } from "../../../lib/cloudinary";

/**
 * Hook for managing image preloading in the gallery
 * @param images Array of gallery images
 * @returns Object containing preload utility function
 */
export function useImagePreload(images: GalleryImage[]) { 
  const preloadFullscreenImage = useCallback((publicId: string) => {
    // Create a hidden image element to preload the fullscreen version
    const img = new Image();
    img.src = getCloudinaryUrl(encodeURIComponent(publicId), {
      width: 2048,
      priority: true
    });
  }, []);

  const preloadImage = useCallback(
    (publicId: string, quality: "medium" | "full") => {
      const img = new Image();
      img.src = getCloudinaryUrl(encodeURIComponent(publicId), {
        ...(quality === "medium" ? { mediumQuality: true } : {}),
        priority: true
      });
    },
    []
  );

  useEffect(() => {
    const preloadImages = images.slice(0, 4);
    const links: HTMLLinkElement[] = [];

    preloadImages.forEach((image, index) => {
      // Medium quality preload
      const mediumLink = document.createElement("link");
      mediumLink.rel = "preload";
      mediumLink.as = "image";
      mediumLink.fetchPriority = index < 2 ? "high" : "low";
      mediumLink.href = getCloudinaryUrl(image.publicId, {
        mediumQuality: true,
        priority: true,
      });
      document.head.appendChild(mediumLink);
      links.push(mediumLink);

      // Full quality preload for first 2 images
      if (index < 2) {
        const fullLink = document.createElement("link");
        fullLink.rel = "preload";
        fullLink.as = "image";
        fullLink.fetchPriority = "high";
        fullLink.href = getCloudinaryUrl(image.publicId, { priority: true });
        document.head.appendChild(fullLink);
        links.push(fullLink);
      }
    });

    return () => {
      links.forEach((link) => document.head.removeChild(link));
    };
  }, [images]);

  return { preloadImage, preloadFullscreenImage };
}
