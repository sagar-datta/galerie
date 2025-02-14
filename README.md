# 🌁 Galerie de Sagar <sup>_Sagar's Gallery_</sup>

A modern, responsive photo gallery application showcasing photos I have taken over time. This gallery, known as "Galerie de Sagar", is built with React, TypeScript, and Vite.

## 🎯 Design Inspiration

The design of this gallery is inspired by the specimen of Neue Helvetica shown in the [Helvetica Wikipedia page](https://upload.wikimedia.org/wikipedia/commons/2/28/HelveticaSpecimenCH.svg). Created in January 2008, this public domain specimen has influenced:

- Typography: Heavy use of Helvetica font family
- Colour Palette: Clean, minimal colours based on the specimen
- Layout Structure: Grid-based organisation reminiscent of type specimens
- Visual Hierarchy: Clear, structured presentation of information

This inspiration ties the gallery to the rich history of Swiss typography while providing a clean, modern presentation for photography.

## ✨ Features

- **🖼️ Dynamic Image Gallery**: Responsive grid layout with advanced modal view for detailed image viewing
- **🏃‍♂️ Cities Ticker**: Interactive horizontal ticker with responsive animations and smooth transitions
- **🏙️ City Selection**: Dynamic city selection with coordinate-based animations and map integration
- **📱 Responsive Design**: Adaptive layout with window size warnings and mobile optimisations
- **🎞️ Image Loading**: Progressive image loading with blur-up effect and preloading system
- **🗺️ Location Data**: Rich location data integration with coordinates and mapping utilities
- **📷 Image Metadata**: Comprehensive metadata display with date formatting and gallery organisation

## 🛠️ Tech Stack

- **⚛️ Framework**: React with TypeScript
- **⚡ Build Tool**: Vite
- **🎨 Styling**: 
  - Tailwind CSS for utility classes
  - Custom CSS modules for complex animations
  - Keyframe animations for smooth transitions
  - Base style variables for consistent theming
- **☁️ Image Hosting**: Cloudinary with progressive loading strategy
- **🔍 Development**: ESLint for code quality
- **🚀 Deployment**: GitHub Actions + GitHub Pages

## 📁 Project Structure

```
src/
├── assets/                    # Static assets and styles
│   └── styles/                 
│       ├── animations/        # Keyframe animations
│       ├── base/              # Reset, variables, window-size
│       └── components/        # Component-specific styles
├── components/                # Shared components
│   └── layout/                # Layout components
├── features/                  # Feature-based modules
│   ├── cities/                # Cities feature
│   │   ├── components/        # CitiesTicker, SelectedCity
│   │   ├── constants/         # Ticker and UI constants
│   │   ├── hooks/             # Animation and responsive hooks
│   │   ├── types/             # Type definitions
│   │   └── utils/             # Coordinates, formatting, image
│   └── gallery/               # Gallery feature
│       ├── components/        # ImageGallery, ImageModal
│       ├── constants/         # Gallery constants
│       ├── hooks/             # Gallery and image hooks
│       ├── types/             # Gallery types
│       └── utils/             # Layout, date, and image utils
├── lib/                       # Shared libraries
│   ├── cloudinary/            # Cloudinary integration
│   ├── data/                  # Application data
│   │   ├── galleries/         # City-specific galleries
│   │   └── metadata/          # Cities metadata
│   └── maps/                  # Maps integration
└── scripts/                   # Utility scripts
    └── fetch-metadata.js      # Metadata fetching utility
```

## 🎨 Creating Your Own Gallery

To create your own version of this gallery:

1. Fork or clone this repository
2. Set up your own Cloudinary account for image hosting
3. Configure environment variables
4. Create folders in Cloudinary for each city
5. Upload images to the corresponding city folders
6. Run the metadata fetch script to automatically generate gallery data
7. Customise the styling and branding to match your preferences

### 📋 Prerequisites

- Node.js (v20 or higher)
- npm or yarn
- Cloudinary account for image hosting

### 🔑 Environment Setup

Create a `.env` file in the root directory:

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_API_KEY=your_api_key
VITE_CLOUDINARY_API_SECRET=your_api_secret
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

These values can be found in your Cloudinary dashboard under Settings > Access Keys. The API key and secret are required for the metadata fetch script to access your Cloudinary account.

### 💻 Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd photo-gallery
```

2. Install dependencies:

```bash
npm install --legacy-peer-deps
```

3. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 🏗️ Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 📝 Development Guidelines

- Follow the feature-based project structure
- Use custom hooks for complex functionality:
  - `useImagePreload` for image loading management
  - `useProgressiveImage` for blur-up effect
  - `useLoadedStates` for loading state tracking
  - `useImageModal` for modal interactions
  - `useTickerAnimation` for smooth ticker animations
- Implement responsive designs with:
  - Window size warnings
  - Adaptive layouts
  - Mobile-first approach
- Utilise utility functions for:
  - Date formatting
  - Coordinate calculations
  - Image transformations
  - Layout management

### 🌍 Adding New Cities

The gallery uses an automated system to manage cities and their images:

1. Create a new folder in your Cloudinary account with the city name
2. Upload your images to the city folder in Cloudinary
   - Images should include metadata (location, date, camera details)
   - Ensure images are high quality and properly oriented
3. Run the metadata fetch script:
   ```bash
   node scripts/fetch-metadata.js
   ```
   This script will:
   - Scan your Cloudinary folders to find cities
   - Create gallery data for each city
   - Extract and organise image metadata
   - Generate all necessary city and image data files
4. The changes will be automatically reflected in the application

## ⚡ Performance Considerations

- Progressive image loading strategy:
  - Blur-up effect for smooth transitions
  - Preloading system for better UX
  - Multiple quality versions (low/medium/high)
- Responsive animation system:
  - CSS keyframe animations
  - Hardware-accelerated transforms
  - Throttled event handlers
- Optimised state management:
  - Custom hooks for complex state
  - Efficient re-render prevention
  - Memoised calculations
- Build and load optimisation:
  - Component-level code splitting
  - Modern browser targeting
  - Efficient caching strategies
  - Modular code structure

## 📄 Licence

This project is licensed under the MIT Licence - see the LICENCE file for details.
