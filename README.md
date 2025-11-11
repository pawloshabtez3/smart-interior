# Smart Interior Design Previewer

A Next.js 14 application for visualizing and customizing interior spaces in real-time 3D.

## Tech Stack

- **Framework**: Next.js 14 with App Router and TypeScript
- **3D Rendering**: React Three Fiber (@react-three/fiber) + Drei (@react-three/drei)
- **State Management**: Zustand
- **Styling**: Tailwind CSS v3
- **Animation**: Framer Motion
- **Snapshot Export**: html2canvas

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

Dependencies are already installed. If you need to reinstall:

```bash
npm install --legacy-peer-deps
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Create a production build:

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## Project Structure

```
├── app/                  # Next.js App Router pages
│   ├── layout.tsx       # Root layout with metadata
│   ├── page.tsx         # Landing page
│   └── globals.css      # Global styles with Tailwind
├── components/          # React components
├── lib/                 # Utilities and state management
├── public/
│   └── models/          # 3D model files (.glb/.gltf)
├── next.config.js       # Next.js configuration
├── tailwind.config.ts   # Tailwind CSS configuration
└── tsconfig.json        # TypeScript configuration
```

## Configuration

### TypeScript

- Strict mode enabled
- Path aliases configured (`@/*` maps to root)
- ES2020 target with ESNext modules

### Tailwind CSS

Custom theme with color palettes:
- Warm theme (tan, saddle brown, peru)
- Cool theme (steel blue, dark cyan, light blue)
- Neutral theme (grays)

### Next.js

- Webpack configured for 3D model loading (.glb/.gltf files)
- App Router enabled
- TypeScript support

## Development Notes

- Use `--legacy-peer-deps` flag when installing new packages due to React version peer dependency conflicts
- 3D models should be placed in `public/models/` directory
- All components use TypeScript with strict type checking
