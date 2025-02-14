import { FC } from 'react'

export const WindowSizeWarning: FC = () => {
  return (
    <div className="window-size-warning bg-white">
      <div className="max-w-md mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">
          Screen Size Not Supported
        </h2>
        <p className="text-xl text-gray-600">
          This photo gallery is designed for desktop and laptop screens.
          Please view on a larger device for the best experience.
        </p>
      </div>
    </div>
  )
}