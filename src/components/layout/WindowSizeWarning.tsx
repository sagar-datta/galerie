import { FC, useEffect, useState } from 'react'

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
    <div className="window-size-warning bg-white">
      <div className="max-w-md mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">
          Screen Size Not Supported
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          This photo gallery requires a minimum screen size of 960x410 pixels.
          Please view on a larger device or resize your window for the best experience.
        </p>
        <div className="space-y-4 text-lg">
          <p className="font-mono">
            Current size: 
            <span className={needsWidth ? 'text-red-500' : 'text-green-500'}>
              {` ${dimensions.width}px`}
            </span>
            {' × '}
            <span className={needsHeight ? 'text-red-500' : 'text-green-500'}>
              {`${dimensions.height}px`}
            </span>
          </p>
          <p className="text-gray-700">
            Make your window {getDirectionMessage()} to continue.
          </p>
          {needsWidth && (
            <div className="flex items-center justify-center gap-2 text-red-500">
              <span>←</span>
              <span>Needs {MIN_WIDTH - dimensions.width}px more width</span>
              <span>→</span>
            </div>
          )}
          {needsHeight && (
            <div className="flex items-center justify-center gap-2 text-red-500">
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