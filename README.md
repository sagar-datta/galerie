# 🌁 Galerie de Sagar <sup>_Sagar's Gallery_</sup>

A modern, responsive photo gallery application showcasing photos I have taken over time. This gallery, known as "Galerie de Sagar", is built with React, TypeScript, and Vite.

## 🎯 Design Inspiration

The design of this gallery is inspired by the specimen of Neue Helvetica shown in the [Helvetica Wikipedia page](https://upload.wikimedia.org/wikipedia/commons/2/28/HelveticaSpecimenCH.svg). Created in January 2008, this public domain specimen has influenced:

- Typography: Heavy use of Helvetica font family
- Color Palette: Clean, minimal colors based on the specimen
- Layout Structure: Grid-based organization reminiscent of type specimens
- Visual Hierarchy: Clear, structured presentation of information

This inspiration ties the gallery to the rich history of Swiss typography while providing a clean, modern presentation for photography.

## ✨ Features

- **🖼️ Dynamic Image Gallery**: Responsive grid layout with modal view for detailed image viewing
- **🏃‍♂️ Cities Ticker**: Interactive horizontal ticker displaying available cities
- **🏙️ City Selection**: Animated city selection with smooth transitions
- **📱 Responsive Design**: Seamless experience across desktop and mobile devices
- **🎞️ Image Loading**: Progressive image loading with blur-up effect
- **🗺️ Location Data**: Integration with Google Maps for location information
- **📷 Image Metadata**: Display of associated image information (camera details, date taken, location)

## 🛠️ Tech Stack

- **⚛️ Framework**: React with TypeScript
- **⚡ Build Tool**: Vite
- **🎨 Styling**: Tailwind CSS with custom animations
- **☁️ Image Hosting**: Cloudinary for optimized image delivery
- **🔍 Development**: ESLint for code quality
- **🚀 Deployment**: GitHub Actions + GitHub Pages

## 📁 Project Structure

```
src/
├── assets/           # Static assets and styles
│   └── styles/      # Global styles and animations
├── components/       # Shared components
│   └── layout/      # Layout components
├── features/        # Feature-based modules
│   ├── cities/      # Cities feature
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── types/
│   └── gallery/     # Gallery feature
│       ├── components/
│       ├── hooks/
│       ├── utils/
│       └── types/
├── lib/            # Shared libraries and data
│   ├── cloudinary/ # Cloudinary integration
│   ├── maps/      # Google Maps integration
│   └── data/      # Application data
│       ├── galleries/
│       └── metadata/
└── types/         # Global type definitions
```

## 🎨 Creating Your Own Gallery

To create your own version of this gallery:

1. Fork or clone this repository
2. Set up your own Cloudinary account for image hosting
3. Configure environment variables
4. Update the galleries in `src/lib/data/galleries/` with your own images
5. Customize the styling and branding to match your preferences
6. Deploy to your preferred hosting platform (e.g., GitHub Pages)

### 📋 Prerequisites

- Node.js (v20 or higher)
- npm or yarn
- Cloudinary account for image hosting

### 🔑 Environment Setup

Create a `.env` file in the root directory:

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

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
- Maintain type safety with TypeScript
- Use Tailwind CSS for styling with custom CSS when needed
- Follow React best practices and functional programming patterns
- Ensure components are responsive and accessible
- Use custom hooks for complex state management

### 🌍 Adding New Cities

To add a new city to the gallery:

1. Create a new city gallery file in `src/lib/data/galleries/`
2. Export the gallery data following the `CityGallery` type
3. Add the city to `src/lib/data/galleries/index.ts`
4. Update metadata in `src/lib/data/metadata/cities.ts`

## ⚡ Performance Considerations

- Progressive image loading with low/medium/high quality versions
- Image optimization through Cloudinary
- Component-level code splitting
- Build optimization with modern browser targeting
- Efficient caching strategies
- Modular code structure for better maintainability

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
