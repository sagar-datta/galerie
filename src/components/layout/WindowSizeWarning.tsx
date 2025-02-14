import { FC, useEffect, useState } from 'react'
import { COLORS } from '../../constants/colors'

const MIN_WIDTH = 960
const MIN_HEIGHT = 410

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

  const getDirectionMessage = () => {
    if (needsWidth && needsHeight) return 'both wider and taller'
    if (needsWidth) return 'wider'
    if (needsHeight) return 'taller'
    return ''
  }

  return (
    <div 
      className="window-size-warning"
      style={{ backgroundColor: COLORS.beige }}
    >
      <div className="max-w-md mx-auto">
        <h2 
          className="text-3xl font-bold mb-6"
          style={{ color: COLORS.coral }}
        >
          Screen Size Not Supported
        </h2>
        <p 
          className="text-xl mb-8"
          style={{ color: COLORS.dark }}
        >
          This photo gallery requires a minimum screen size of 960x410 pixels.
          Please view on a larger device or resize your window for the best experience.
        </p>
        <div className="space-y-4 text-lg">
          <p className="font-mono" style={{ color: COLORS.dark }}>
            Current size: 
            <span style={{ color: needsWidth ? COLORS.red : '#22C55E' }}>
              {` ${dimensions.width}px`}
            </span>
            {' × '}
            <span style={{ color: needsHeight ? COLORS.red : '#22C55E' }}>
              {`${dimensions.height}px`}
            </span>
          </p>
          <p style={{ color: COLORS.dark }}>
            Make your window {getDirectionMessage()} to continue.
          </p>
          {needsWidth && (
            <div 
              className="flex items-center justify-center gap-2"
              style={{ color: COLORS.red }}
            >
              <span>←</span>
              <span>Needs {MIN_WIDTH - dimensions.width}px more width</span>
              <span>→</span>
            </div>
          )}
          {needsHeight && (
            <div 
              className="flex items-center justify-center gap-2"
              style={{ color: COLORS.red }}
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