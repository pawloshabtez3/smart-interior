# Deployment Guide

## Vercel Deployment

This application is optimized for deployment on Vercel.

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Vercel account (free tier is sufficient)

### Environment Variables

**No environment variables are required for the MVP.** The application runs entirely client-side with no external API dependencies.

### Deployment Steps

#### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. For production deployment:
   ```bash
   vercel --prod
   ```

#### Option 2: Deploy via GitHub Integration

1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Next.js and configure build settings
6. Click "Deploy"

### Build Configuration

The following settings are automatically configured:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Development Command**: `npm run dev`

### Static Assets

All static assets are served from the `/public` directory:
- 3D models: `/public/models/*.glb`
- These are automatically served at `/models/*.glb` in production

### Production Verification

After deployment, verify the following:

1. **Landing Page**: Visit the root URL (`/`)
2. **Design Interface**: Test all room routes:
   - `/preview/living-room`
   - `/preview/bedroom`
   - `/preview/office`
3. **3D Models**: Verify models load correctly
4. **LocalStorage**: Test that preferences persist across page reloads
5. **Snapshot Export**: Test the save snapshot functionality
6. **Responsive Design**: Test on mobile, tablet, and desktop viewports

### Performance Optimizations

The application includes several production optimizations:

- **SWC Minification**: Enabled for faster builds and smaller bundles
- **React Strict Mode**: Enabled for better development warnings
- **Console Log Removal**: Production builds remove console.logs (except errors/warnings)
- **Package Import Optimization**: Optimized imports for three.js, React Three Fiber, and Framer Motion
- **Code Splitting**: Automatic code splitting for optimal loading

### Troubleshooting

#### Build Failures

If the build fails, check:
- Node.js version (must be 18.x or higher)
- All dependencies are installed: `npm install`
- TypeScript compilation: `npm run build` locally

#### 3D Models Not Loading

If models don't load in production:
- Verify files exist in `/public/models/`
- Check browser console for 404 errors
- Ensure file extensions are lowercase (`.glb`)

#### Performance Issues

If the app is slow:
- Check browser WebGL support
- Test on different devices/browsers
- Monitor frame rate in browser DevTools

### Local Production Testing

To test the production build locally:

```bash
# Build the application
npm run build

# Start production server
npm start

# Or on a different port
npm start -- -p 3001
```

Then visit `http://localhost:3000` (or your specified port) to test.

### Monitoring

After deployment, monitor:
- Vercel Analytics (if enabled)
- Browser console for errors
- User feedback on performance
- Loading times for 3D models

### Rollback

If issues occur after deployment:
1. Go to Vercel dashboard
2. Select your project
3. Go to "Deployments"
4. Find a previous working deployment
5. Click "..." menu and select "Promote to Production"

## Additional Notes

- The application uses client-side rendering for 3D content
- No server-side API routes are required
- All state is managed client-side with Zustand and localStorage
- The app is fully static except for the dynamic `[room]` route parameter
