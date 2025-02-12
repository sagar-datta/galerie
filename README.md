# City Photo Gallery

A modern, responsive photo gallery application showcasing images from various cities around the world. Built with React, TypeScript, and Vite.

## Features

- **Dynamic Image Gallery**: Responsive grid layout with modal view for detailed image viewing
- **Cities Ticker**: Interactive horizontal ticker displaying available cities
- **City Selection**: Filter gallery by selecting specific cities
- **Responsive Design**: Seamless experience across desktop and mobile devices

## Tech Stack

- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: CSS Modules + Tailwind CSS
- **Development**: ESLint for code quality

## Project Structure

```
src/
├── components/           # React components
│   ├── ImageGallery/    # Gallery related components
│   │   ├── ImageGallery.tsx
│   │   ├── ImageGallery.css
│   │   ├── ImageModal.tsx
│   │   └── utils.ts
│   ├── CitiesTicker.tsx
│   ├── MainFooter.tsx
│   └── SelectedCity.tsx
├── constants/           # Application constants
│   └── colors.ts
├── data/               # Data management
│   ├── cities/         # City-specific data
│   │   ├── barcelona.ts
│   │   ├── paris.ts
│   │   └── index.ts
│   └── images.ts
├── types/              # TypeScript type definitions
│   └── gallery.types.ts
├── App.tsx            # Main application component
└── main.tsx          # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd photo-gallery
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Development Guidelines

- Follow the established project structure when adding new features
- Maintain type safety with TypeScript
- Use CSS Modules for component-specific styles
- Follow React best practices and functional programming patterns
- Ensure components are responsive and accessible

## Performance Considerations

- Images are optimized for web delivery
- Components are structured for efficient rendering
- Modular code structure enables code splitting
- City data is organized for scalable management

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
