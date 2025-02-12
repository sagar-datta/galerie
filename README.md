# 🖼️ Galerie de Sagar <sub>_Sagar's Gallery_</sub>

A modern, responsive photo gallery application showcasing images from various cities around the world. This gallery, known as "Galerie de Sagar", is built with React, TypeScript, and Vite.

## ✨ Features

- **🖼️ Dynamic Image Gallery**: Responsive grid layout with modal view for detailed image viewing
- **🏃‍♂️ Cities Ticker**: Interactive horizontal ticker displaying available cities
- **🎯 City Selection**: Filter gallery by selecting specific cities
- **📱 Responsive Design**: Seamless experience across desktop and mobile devices

## 🛠️ Tech Stack

- **⚛️ Framework**: React with TypeScript
- **⚡ Build Tool**: Vite
- **🎨 Styling**: CSS Modules + Tailwind CSS
- **🔍 Development**: ESLint for code quality

## 📁 Project Structure

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
│   ├── cities/         # City-specific data files
│   │   └── index.ts    # City data aggregation
│   └── images.ts       # Image data management
├── types/              # TypeScript type definitions
│   └── gallery.types.ts
├── App.tsx            # Main application component
└── main.tsx          # Application entry point
```

## 🚀 Getting Started

### 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### 💻 Installation

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

### ��️BBuiling fforPProducioon

````bssh
npmrru bbuldd
```
TTh bbull files wwll be in the ``iss``ddrrctoor..
## w📝dDllrleppt ssGri fledrs
 MoFurlow the est blishedoprejscttructure enwhaboa ding nswpfeaturel
- Matniag
i dpeasafe ysw thrTypeScaept
- Us  CSS Mofulesor sclonpoge

-specific styles#-Ftllow Reaci tesnrpaec icas fndeaeh
tioneloprrgcgmmies patt
rn3.-uEnsmre cotponenas preeqesponsivu and accts
ible###  🌍 Adding📄NewiCitees

To add a new nity to ths gall
ry:Thi1. Create a new city data file in `src/data/cities/`
2. Export the city data following the established type definitions
3. Update the city index file to include the new city

## ⚡ Performance Considerations

- Images are optimized for web delivery
- Components are structured for efficient rendering
- Modular code structure enables code splitting
- City data is organized for scalable management

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
````
