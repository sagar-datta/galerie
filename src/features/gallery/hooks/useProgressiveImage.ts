import { useState, useEffect } from "react"
import { getCloudinaryUrl } from "../../../lib/cloudinary"

export interface ProgressiveImageState {
  currentSrc: string
}

/**
 * Hook to handle progressive image loading from low to standard quality
 */
export function useProgressiveImage(publicId: string) {
  const [state, setState] = useState<ProgressiveImageState>({
    currentSrc: ""
  })

  useEffect(() => {
    // Reset state when publicId changes
    setState({ 
      currentSrc: getCloudinaryUrl(encodeURIComponent(publicId), {
        width: 1200,
        mediumQuality: true
      })
    })

    // Array of quality levels to load in sequence
    const qualityLevels = [
      { // Medium preview
        width: 1200,
        priority: true
      },
      { 
        width: 1200,
        priority: true
      }
    ]

    // Load each quality level immediately
    qualityLevels.forEach((quality) => {
      const img = new Image()
      img.src = getCloudinaryUrl(encodeURIComponent(publicId), quality)
      
      img.onload = () => {
        // Only update if it's a higher quality than current
        setState(prev => {
          // Always update to higher quality versions
          const currentQuality = prev.currentSrc.includes("mediumQuality")
          if (currentQuality) {
            return {
              currentSrc: img.src
            } 
          }
          return prev
        })
      }
    })
  }, [publicId])

  return state
}