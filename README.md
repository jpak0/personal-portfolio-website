# Personal Portfolio Website

An interactive 3D portfolio website featuring real-time satellite visualization, tactical radio communications theme, and responsive design. Built with modern web technologies to showcase my projects and experience in an engaging, visually immersive environment.

## Description

This portfolio website presents my professional experience, projects, and contact information through an interactive 3D Earth visualization. The site features orbital satellites with realistic flight paths, L3Harris tactical ground stations with RF signal visualization, real-time satellite telemetry streams, and a space-themed UI with astronaut avatar. The design emphasizes my work in defense technology and signal processing with a "classified" aesthetic.

## Technical Stack & Implementation

### Core Technologies
- **React 19.1.1** - Component-based UI architecture with hooks (useState, useEffect, useRef)
- **Three.js 0.180.0** - WebGL-based 3D graphics rendering engine
- **Vite 7.1.7** - Next-generation frontend build tool with HMR (Hot Module Replacement)
- **Tailwind CSS 3.4.1** - Utility-first CSS framework with custom responsive design
- **PostCSS 8.5.6** & **Autoprefixer 10.4.21** - CSS processing and vendor prefixing

### 3D Graphics & Visualization
- **Custom Three.js Scene Management** - PerspectiveCamera, WebGLRenderer with antialiasing
- **Procedural Generation** - Dynamic starfield particles (15,000+ stars) with spherical distribution
- **Shader Programming** - Custom GLSL vertex/fragment shaders for atmospheric glow effects
- **Advanced Lighting** - Multiple directional lights (sun + fill) with ambient lighting
- **Particle Systems** - Buffer geometry with custom attributes for rings and starfields
- **Dynamic Geometry** - Real-time satellite orbits, RF signal waves, and flight path curves

### Advanced Features
- **Real-time Animation Loop** - RequestAnimationFrame for 60fps rendering
- **Interactive Camera Controls** - Mouse-driven camera movement with smooth lerp transitions
- **Custom Materials** - ShaderMaterial, MeshPhongMaterial, MeshStandardMaterial with PBR
- **Geometric Modeling** - Procedural continent outlines, satellite components, ground stations
- **Signal Visualization** - Wavy RF beams using sine wave mathematics and perpendicular vectors
- **Responsive Design** - Window resize handling with aspect ratio preservation

### Development Tools
- **ESLint 9.36.0** - Code linting with React-specific rules
- **@vitejs/plugin-react 5.0.4** - Fast Refresh and JSX transformation
- **TypeScript Type Definitions** - Type safety for React components

### Performance Optimizations
- **BufferGeometry** - Efficient vertex data storage for thousands of particles
- **PointsMaterial** - Hardware-accelerated point rendering
- **Additive Blending** - GPU-optimized transparency for glows and effects
- **Size Attenuation** - Perspective-correct particle sizing
- **Disposal Pattern** - Proper cleanup to prevent memory leaks

### Mathematical Implementations
- **Lat/Lon to 3D Conversion** - Spherical coordinate transformation
- **Orbital Mechanics** - Parametric circle equations for satellite paths
- **Wave Generation** - Sine wave displacement for RF signal visualization
- **Vector Mathematics** - Three.js Vector3 for positions, directions, and transformations
- **Fresnel Effect** - View-dependent glow using dot product calculations

## Project Structure
```
my-portfolio/
├── src/
│   ├── App.jsx          # Main 3D portfolio component
│   ├── main.jsx         # React entry point
│   ├── index.css        # Global styles
│   └── app.css          # Component styles
├── index.html           # HTML template
├── package.json         # Dependencies
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
└── eslint.config.js     # ESLint rules
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Features
- Interactive 3D Earth with continent outlines and atmospheric glow
- 6 orbital satellites with realistic metallic materials and solar panels
- L3Harris tactical ground stations with RF communication beams
- Real-time satellite telemetry log stream
- Mouse-driven camera movement
- Responsive navigation menu
- Multiple content sections (Home, Experience, Projects, Contact, About)
- Animated astronaut avatar with custom CSS
- City markers and flight paths
- Particle ring system around Earth

## License
Personal portfolio project - All rights reserved
