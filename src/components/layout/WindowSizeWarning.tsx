import { FC, useEffect, useState } from 'react'
import { COLORS } from '../../constants/colors'

const MIN_WIDTH = 961
const MIN_HEIGHT = 411

export const WindowSizeWarning: FC = () => {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const needsWidth = dimensions.width < MIN_WIDTH
  const needsHeight = dimensions.height < MIN_HEIGHT
  
  // Calculate scale factor based on how far we are from min dimensions
  const getScaleFactor = () => {
    const widthRatio = Math.min(dimensions.width / MIN_WIDTH, 1)
    const heightRatio = Math.min(dimensions.height / MIN_HEIGHT, 1)
    // Use the smaller ratio to ensure text stays readable
    const scale = Math.max(Math.min(widthRatio, heightRatio), 0.5)
    return scale
  }
  const scaleFactor = getScaleFactor()

  const getDirectionMessage = () => {
    if (needsWidth && needsHeight) return 'both wider and taller'
    if (needsWidth) return 'wider'
    if (needsHeight) return 'taller'
    return ''
  }

  return (
    <div 
      className="window-size-warning"
      style={{ 
        backgroundColor: COLORS.beige, 
        border: `10px solid ${COLORS.coral}`,
        minHeight: '100vh'
      }}
    >
      <div className="max-w-md mx-auto w-full">
        <h2 
          className="font-bold mb-6"
          style={{ 
            color: COLORS.coral,
            fontSize: `${2.5 * scaleFactor}rem`
          }}
        >
          Screen Size Not Supported
        </h2>
        <p 
          className="mb-8"
          style={{ color: COLORS.dark, fontSize: `${1.25 * scaleFactor}rem` }}
        >
          This photo gallery requires a minimum screen size of 961x411 pixels.
          Please view on a larger device or resize your window for the best experience.
        </p>
        <div className="space-y-4 text-lg">
          <p className="font-mono" style={{ color: COLORS.dark, fontSize: `${1.125 * scaleFactor}rem` }}>
            Current size: 
            <span style={{ color: needsWidth ? COLORS.red : '#22C55E' }}>
              {` ${dimensions.width}px`}
            </span>
            {' × '}
            <span style={{ color: needsHeight ? COLORS.red : '#22C55E' }}>
              {`${dimensions.height}px`}
            </span>
          </p>
          <p style={{ color: COLORS.dark, fontSize: `${1.125 * scaleFactor}rem` }}>
            Make your window {getDirectionMessage()} to continue.
          </p>
          {needsWidth && (
            <div 
              className="flex items-center justify-center gap-2"
              style={{ color: COLORS.red, fontSize: `${1.125 * scaleFactor}rem` }}
            >
              <span>←</span>
              <span>Needs {MIN_WIDTH - dimensions.width}px more width</span>
              <span>→</span>
            </div>
          )}
          {needsHeight && (
            <div 
              className="flex items-center justify-center gap-2"
              style={{ color: COLORS.red, fontSize: `${1.125 * scaleFactor}rem` }}
            >
              <span>↑</span>
              <span>Needs {MIN_HEIGHT - dimensions.height}px more height</span>
              <span>↓</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}