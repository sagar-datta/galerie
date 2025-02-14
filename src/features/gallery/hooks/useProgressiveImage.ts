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
        width: 1600,
        mediumQuality: true,
        priority: true
      })
    })

    // Array of quality levels to load in sequence
    const qualityLevels = [
      { // Initial preview
        width: 1600,
        mediumQuality: true,
        priority: true
      },
      { // High quality 
        width: 1600,
        priority: true,
      }
    ]

    // Load each quality level immediately
    qualityLevels.forEach((quality, index) => {
      const img = new Image()
      img.src = getCloudinaryUrl(encodeURIComponent(publicId), quality)
      
      img.onload = () => {
        // Only update if it's a higher quality than current
        if (index === 0) {
          // Skip first quality level as it's already set in initial state
          return
        }
        
        setState(prev => {
          // Always update to higher quality version
          const isMediumQuality = prev.currentSrc.includes("q_auto:eco")
          if (isMediumQuality) {
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