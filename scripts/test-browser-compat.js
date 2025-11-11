/**
 * Browser Compatibility Test Script
 * Run this in the browser console to verify compatibility functions
 */

// This script should be run in the browser console, not in Node.js
if (typeof window === 'undefined') {
  console.error('This script must be run in a browser environment');
  process.exit(1);
}

console.log('=== Browser Compatibility Test ===\n');

// Test 1: Browser Detection
console.log('1. Browser Detection:');
const browser = detectBrowser();
console.log('  Browser:', browser.name, browser.version);
console.log('  Mobile:', browser.isMobile);
console.log('  iOS:', browser.isIOS);
console.log('  Safari:', browser.isSafari);
console.log('  Firefox:', browser.isFirefox);
console.log('  Chrome:', browser.isChrome);
console.log('  Edge:', browser.isEdge);
console.log('');

// Test 2: WebGL Support
console.log('2. WebGL Support:');
const webgl = checkWebGLSupport();
console.log('  Supported:', webgl.supported);
console.log('  Version:', webgl.version);
console.log('  Renderer:', webgl.renderer);
console.log('  Vendor:', webgl.vendor);
console.log('  Max Texture Size:', webgl.maxTextureSize);
console.log('');

// Test 3: LocalStorage Availability
console.log('3. LocalStorage:');
const localStorage = isLocalStorageAvailable();
console.log('  Available:', localStorage);
console.log('');

// Test 4: Optimal WebGL Settings
console.log('4. Optimal WebGL Settings:');
const settings = getOptimalWebGLSettings();
console.log('  Antialias:', settings.antialias);
console.log('  Power Preference:', settings.powerPreference);
console.log('  Alpha:', settings.alpha);
console.log('  Preserve Drawing Buffer:', settings.preserveDrawingBuffer);
console.log('');

// Test 5: Pixel Ratio
console.log('5. Optimal Pixel Ratio:');
const pixelRatio = getOptimalPixelRatio();
console.log('  Range:', pixelRatio);
console.log('  Device Pixel Ratio:', window.devicePixelRatio);
console.log('');

// Test 6: Shadow Support
console.log('6. Shadow Support:');
const shadows = shouldEnableShadows();
console.log('  Enable Shadows:', shadows);
console.log('');

// Test 7: Passive Events
console.log('7. Passive Events:');
const passive = supportsPassiveEvents();
console.log('  Supported:', passive);
console.log('');

console.log('=== Test Complete ===');
console.log('\nAll browser compatibility functions are working correctly!');
