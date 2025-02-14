import { useState, useEffect } from "react"
import { getCloudinaryUrl } from "../../../lib/cloudinary"

export interface ProgressiveImageState {
  currentSrc: string
}

/**
 * Hook to handle progressive image loading from medium to high quality
 */
export function useProgressiveImage(publicId: string) {
  const [state, setState] = useState<ProgressiveImageState>({
    currentSrc: ""
  })

  useEffect(() => {
    // Reset state when publicId changes
    setState({
      // Start with very low quality blurred placeholder
      currentSrc: getCloudinaryUrl(encodeURIComponent(publicId), { 
        lowQuality: true
      }),

    })

    // Array of quality levels to load in sequence
    const qualityLevels = [
      { // Medium preview
        width: 800,
        priority: true
      },
      { width: 1200, priority: true },
      { width: 1600, priority: true }
    ]

    // Load each quality level immediately
    qualityLevels.forEach((quality, _index) => {
      const img = new Image()
      img.src = getCloudinaryUrl(encodeURIComponent(publicId), quality)
      
      img.onload = () => {
        // Only update if it's a higher quality than current
        setState(prev => {
          // If current is low quality placeholder, always upgrade
          const isCurrentLowQuality = prev.currentSrc.includes("w_20,e_blur:1000")
          
          if (isCurrentLowQuality) {
            return {
              currentSrc: img.src
            }
          }
          
          const currentWidth = Number(prev.currentSrc.match(/w_(\d+)/)?.[1] || 0)
          if (currentWidth === 0 || quality.width > currentWidth) {
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