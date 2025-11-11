# Browser Testing Guide

## Quick Start

This guide helps you test the Smart Interior Design Previewer across different browsers to ensure compatibility.

## Prerequisites

- Application built and running (`npm run dev` or `npm run build && npm start`)
- Access to different browsers for testing
- Mobile devices or browser dev tools for mobile testing

## Testing Procedure

### 1. Automated Build Verification

First, ensure the application builds without errors:

```bash
npm run build
```

Expected output: ✓ Compiled successfully

### 2. Browser Console Testing

Open the application in each browser and check the console for compatibility information:

1. Open browser DevTools (F12)
2. Navigate to Console tab
3. Look for initialization logs:

```
Browser Compatibility Info: {
  browser: "chrome 120",
  mobile: false,
  iOS: false,
  webgl: "WebGL 2",
  localStorage: "Available"
}
```

### 3. Manual Feature Testing

For each browser, test the following features:

#### A. Initial Load
- [ ] Application loads without errors
- [ ] WebGL context initializes successfully
- [ ] Default room (living-room) displays correctly
- [ ] Control panel is visible and styled correctly

#### B. Room Type Selection
- [ ] Click "Bedroom" - model loads within 3 seconds
- [ ] Click "Office" - model loads within 3 seconds
- [ ] Click "Living Room" - model loads within 3 seconds
- [ ] Active selection is highlighted

#### C. Style Preset Selection
- [ ] Click "Modern" - materials update within 1 second
- [ ] Click "Boho" - materials update within 1 second
- [ ] Click "Minimalist" - materials update within 1 second
- [ ] Transitions are smooth

#### D. Color Theme Selection
- [ ] Click "Warm" - colors update within 1 second
- [ ] Click "Cool" - colors update within 1 second
- [ ] Click "Neutral" - colors update within 1 second
- [ ] Color swatches display correctly

#### E. Lighting Mood Selection
- [ ] Click "Morning" - lighting updates within 1 second
- [ ] Click "Evening" - lighting updates within 1 second
- [ ] Click "Night" - lighting updates within 1 second
- [ ] Icons display correctly

#### F. 3D Canvas Interactions
- [ ] Mouse drag rotates camera (desktop)
- [ ] Mouse wheel zooms in/out (desktop)
- [ ] Right-click drag pans camera (desktop)
- [ ] Touch drag rotates camera (mobile)
- [ ] Pinch gesture zooms (mobile)
- [ ] Two-finger drag pans (mobile)
- [ ] Camera constraints work (can't go below floor)

#### G. Snapshot Export
- [ ] Click "Save Snapshot" button
- [ ] Loading indicator appears
- [ ] Image downloads successfully
- [ ] Filename format: `interior-design-{room}-{timestamp}.png`
- [ ] Image quality is acceptable
- [ ] Success message displays

#### H. LocalStorage Persistence
- [ ] Change room type, style, color, and lighting
- [ ] Refresh the page (F5)
- [ ] Settings are restored correctly
- [ ] Test in private/incognito mode (should use defaults)

#### I. Responsive Layout
- [ ] Resize window to mobile width (<1024px)
- [ ] Control panel becomes bottom sheet
- [ ] Toggle button appears and works
- [ ] Canvas adjusts to available space
- [ ] All controls remain accessible

## Browser-Specific Testing

### Chrome (Desktop)
**Version**: Latest stable

**Special Checks**:
- [ ] WebGL 2 is used (check console)
- [ ] High-performance power preference
- [ ] Shadows render correctly
- [ ] 2x pixel ratio on high-DPI displays

**Known Issues**: None expected

---

### Firefox (Desktop)
**Version**: Latest stable

**Special Checks**:
- [ ] Shadow map size is 1024px (check console)
- [ ] Shadows only enabled on version 90+
- [ ] Performance is acceptable
- [ ] No console warnings

**Known Issues**: 
- Older versions (<90) may have shadow performance issues (shadows disabled automatically)

---

### Safari (Desktop - macOS)
**Version**: Latest stable

**Special Checks**:
- [ ] Canvas.toBlob polyfill applied (check console)
- [ ] Snapshot export works with delays
- [ ] PreserveDrawingBuffer enabled for screenshots
- [ ] No security warnings for WebGL

**Known Issues**:
- May require longer delays for blob cleanup (500ms vs 100ms)
- Older versions may need canvas.toBlob polyfill

---

### Edge (Desktop)
**Version**: Latest stable (Chromium-based)

**Special Checks**:
- [ ] Behaves similar to Chrome
- [ ] WebGL 2 support
- [ ] All features work identically

**Known Issues**: None expected

---

### iOS Safari (Mobile)
**Version**: Latest iOS version

**Special Checks**:
- [ ] Touch events work correctly
- [ ] No page scrolling during canvas interaction
- [ ] Pinch-to-zoom works with two fingers
- [ ] Touch targets are minimum 44px
- [ ] Bottom sheet control panel works
- [ ] Performance is acceptable (30fps minimum)
- [ ] Shadows are disabled (check console)
- [ ] Lower pixel ratio used (1-1.5x)

**Known Issues**:
- May have stricter memory limits
- Private browsing blocks localStorage

**Testing Steps**:
1. Open on iPhone/iPad
2. Test single-finger drag (should rotate, not scroll)
3. Test two-finger pinch (should zoom)
4. Test two-finger drag (should pan)
5. Tap control panel toggle
6. Test all controls with touch

---

### Chrome Mobile (Android)
**Version**: Latest stable

**Special Checks**:
- [ ] Touch interactions work smoothly
- [ ] Bottom sheet control panel works
- [ ] Performance is acceptable
- [ ] Shadows are disabled
- [ ] Lower pixel ratio used

**Known Issues**: None expected

**Testing Steps**:
1. Open on Android device
2. Test touch interactions
3. Verify performance
4. Test snapshot export

---

## Performance Testing

### Desktop Performance Targets
- **Frame Rate**: 60 FPS during interactions
- **Load Time**: <3 seconds for model loading
- **Transition Time**: <1 second for material/lighting changes

### Mobile Performance Targets
- **Frame Rate**: 30 FPS minimum during interactions
- **Load Time**: <5 seconds for model loading
- **Transition Time**: <1 second for material/lighting changes

### How to Measure
1. Open browser DevTools
2. Go to Performance tab
3. Start recording
4. Interact with the application
5. Stop recording
6. Check FPS and frame times

## Debugging Common Issues

### Issue: WebGL Not Supported
**Symptoms**: Black screen with error message

**Solutions**:
1. Update browser to latest version
2. Enable hardware acceleration in browser settings
3. Update graphics drivers
4. Try different browser

### Issue: LocalStorage Not Working
**Symptoms**: Settings don't persist after refresh

**Solutions**:
1. Check if in private/incognito mode (expected behavior)
2. Check browser privacy settings
3. Clear browser data and try again
4. Check console for specific errors

### Issue: Snapshot Export Fails
**Symptoms**: Error message when clicking Save Snapshot

**Solutions**:
1. Check browser console for specific error
2. Try different browser
3. Ensure sufficient storage space
4. Check browser permissions

### Issue: Touch Interactions Not Working (Mobile)
**Symptoms**: Can't rotate/zoom on mobile

**Solutions**:
1. Ensure touch-action CSS is applied
2. Check for JavaScript errors in console
3. Try refreshing the page
4. Update mobile browser

### Issue: Poor Performance
**Symptoms**: Low frame rate, stuttering

**Solutions**:
1. Close other tabs/applications
2. Check if shadows are disabled on mobile
3. Verify pixel ratio is appropriate
4. Try on different device/browser

## Automated Testing (Future)

### Recommended Tools
- **Playwright**: Cross-browser automated testing
- **BrowserStack**: Real device testing
- **Percy**: Visual regression testing

### Test Coverage Goals
- [ ] Unit tests for browser detection functions
- [ ] Integration tests for localStorage
- [ ] E2E tests for user flows
- [ ] Visual regression tests for UI consistency

## Reporting Issues

When reporting browser compatibility issues, include:

1. **Browser**: Name and version
2. **OS**: Operating system and version
3. **Device**: Desktop/mobile, model if mobile
4. **Console Logs**: Any errors or warnings
5. **Screenshots**: Visual issues
6. **Steps to Reproduce**: Detailed steps
7. **Expected vs Actual**: What should happen vs what happens

## Conclusion

Following this guide ensures the application works correctly across all supported browsers. Regular testing should be performed after any significant changes to maintain compatibility.

## Quick Reference

### Supported Browsers
✅ Chrome (latest)
✅ Firefox (latest)
✅ Safari (latest)
✅ Edge (latest)
✅ iOS Safari (latest iOS)
✅ Chrome Mobile (latest)

### Minimum Requirements
- WebGL 1.0 support
- ES6 JavaScript support
- CSS Grid and Flexbox support
- Touch events (mobile)

### Optional Features
- WebGL 2.0 (enhanced performance)
- LocalStorage (preference persistence)
- High pixel ratio displays (better quality)
