import { FC } from 'react'

export const WindowSizeWarning: FC = () => {
  return (
    <div className="window-size-warning bg-white">
      <div className="max-w-md mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">
          Screen Size Not Supported
        </h2>
        <p className="text-xl text-gray-600">
          This photo gallery requires a minimum screen size of 960x410 pixels.
          Please view on a larger device or resize your window for the best experience.
        </p>
      </div>
    </div>
  )
}