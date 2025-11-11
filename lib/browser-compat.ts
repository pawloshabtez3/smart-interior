/**
 * Browser Compatibility Utilities
 * Handles cross-browser compatibility for WebGL, localStorage, and touch interactions
 */

/**
 * Detect browser type and version
 */
export function detectBrowser(): {
  name: string;
  version: string;
  isMobile: boolean;
  isIOS: boolean;
  isSafari: boolean;
  isFirefox: boolean;
  isChrome: boolean;
  isEdge: boolean;
} {
  if (typeof window === 'undefined') {
    return {
      name: 'unknown',
      version: '0',
      isMobile: false,
      isIOS: false,
      isSafari: false,
      isFirefox: false,
      isChrome: false,
      isEdge: false,
    };
  }

  const ua = window.navigator.userAgent;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isSafari = /^((?!chrome|android).)*safari/i.test(ua);
  const isFirefox = /Firefox/i.test(ua);
  const isChrome = /Chrome/i.test(ua) && !/Edge/i.test(ua);
  const isEdge = /Edge/i.test(ua) || /Edg/i.test(ua);

  let name = 'unknown';
  let version = '0';

  if (isEdge) {
    name = 'edge';
    const match = ua.match(/Edg\/(\d+)/);
    version = match ? match[1] : '0';
  } else if (isChrome) {
    name = 'chrome';
    const match = ua.match(/Chrome\/(\d+)/);
    version = match ? match[1] : '0';
  } else if (isSafari) {
    name = 'safari';
    const match = ua.match(/Version\/(\d+)/);
    version = match ? match[1] : '0';
  } else if (isFirefox) {
    name = 'firefox';
    const match = ua.match(/Firefox\/(\d+)/);
    version = match ? match[1] : '0';
  }

  return {
    name,
    version,
    isMobile,
    isIOS,
    isSafari,
    isFirefox,
    isChrome,
    isEdge,
  };
}

/**
 * Check if localStorage is available and working
 * Some browsers block localStorage in private/incognito mode
 */
export function isLocalStorageAvailable(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const testKey = '__localStorage_test__';
    window.localStorage.setItem(testKey, 'test');
    window.localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    // localStorage is not available (private mode, quota exceeded, etc.)
    console.warn('localStorage is not available:', e);
    return false;
  }
}

/**
 * Check WebGL support with fallback to experimental-webgl
 */
export function checkWebGLSupport(): {
  supported: boolean;
  version: number;
  renderer?: string;
  vendor?: string;
  maxTextureSize?: number;
} {
  if (typeof window === 'undefined') {
    return { supported: false, version: 0 };
  }

  try {
    const canvas = document.createElement('canvas');
    
    // Try WebGL 2 first
    let gl: WebGLRenderingContext | WebGL2RenderingContext | null = canvas.getContext('webgl2');
    let version = 2;
    
    // Fallback to WebGL 1
    if (!gl) {
      gl = canvas.getContext('webgl');
      version = 1;
    }
    
    // Fallback to experimental-webgl (older browsers)
    if (!gl) {
      gl = canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
      version = 1;
    }

    if (!gl) {
      return { supported: false, version: 0 };
    }

    // Get additional info
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;

    return {
      supported: true,
      version,
      renderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string : undefined,
      vendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) as string : undefined,
      maxTextureSize,
    };
  } catch (e) {
    console.error('WebGL detection failed:', e);
    return { supported: false, version: 0 };
  }
}

/**
 * Get optimal WebGL settings based on browser and device
 */
export function getOptimalWebGLSettings(): {
  antialias: boolean;
  powerPreference: 'default' | 'high-performance' | 'low-power';
  alpha: boolean;
  preserveDrawingBuffer: boolean;
  failIfMajorPerformanceCaveat: boolean;
} {
  const browser = detectBrowser();
  const isMobile = browser.isMobile;
  const isSafari = browser.isSafari;

  return {
    antialias: !isMobile, // Disable on mobile for performance
    powerPreference: isMobile ? 'low-power' : 'high-performance',
    alpha: false, // Opaque canvas for better performance
    preserveDrawingBuffer: false, // Better performance, but may affect screenshots
    failIfMajorPerformanceCaveat: false, // Allow software rendering as fallback
  };
}

/**
 * Fix for iOS Safari touch event handling
 * iOS Safari requires explicit touch-action CSS and preventDefault
 */
export function setupIOSTouchFix(element: HTMLElement): () => void {
  const browser = detectBrowser();
  
  if (!browser.isIOS) {
    return () => {}; // No cleanup needed
  }

  // Prevent default touch behavior to avoid scrolling during 3D interaction
  const preventDefaultTouch = (e: TouchEvent) => {
    if (e.touches.length > 1) {
      // Allow pinch-to-zoom
      return;
    }
    // Prevent scrolling for single touch
    e.preventDefault();
  };

  element.addEventListener('touchstart', preventDefaultTouch, { passive: false });
  element.addEventListener('touchmove', preventDefaultTouch, { passive: false });

  // Return cleanup function
  return () => {
    element.removeEventListener('touchstart', preventDefaultTouch);
    element.removeEventListener('touchmove', preventDefaultTouch);
  };
}

/**
 * Fix for Safari canvas.toBlob() which may not be available
 * Provides polyfill for older Safari versions
 */
export function ensureCanvasToBlobSupport(): void {
  if (typeof HTMLCanvasElement === 'undefined') {
    return;
  }

  if (!HTMLCanvasElement.prototype.toBlob) {
    Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
      value: function (
        callback: BlobCallback,
        type?: string,
        quality?: number
      ) {
        const canvas = this as HTMLCanvasElement;
        setTimeout(() => {
          try {
            const dataURL = canvas.toDataURL(type || 'image/png', quality);
            const binStr = atob(dataURL.split(',')[1]);
            const len = binStr.length;
            const arr = new Uint8Array(len);

            for (let i = 0; i < len; i++) {
              arr[i] = binStr.charCodeAt(i);
            }

            callback(new Blob([arr], { type: type || 'image/png' }));
          } catch (e) {
            console.error('Canvas toBlob polyfill failed:', e);
            callback(null);
          }
        });
      },
    });
  }
}

/**
 * Fix for Firefox performance issues with shadows
 */
export function shouldEnableShadows(): boolean {
  const browser = detectBrowser();
  
  // Disable shadows on mobile for performance
  if (browser.isMobile) {
    return false;
  }
  
  // Firefox has performance issues with shadows in some cases
  if (browser.isFirefox) {
    // Only enable on newer Firefox versions
    return parseInt(browser.version) >= 90;
  }
  
  return true;
}

/**
 * Get optimal pixel ratio for canvas rendering
 */
export function getOptimalPixelRatio(): [number, number] {
  const browser = detectBrowser();
  const devicePixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio : 1;
  
  if (browser.isMobile) {
    // Limit pixel ratio on mobile to improve performance
    return [1, Math.min(1.5, devicePixelRatio)];
  }
  
  // Desktop: use device pixel ratio up to 2x
  return [1, Math.min(2, devicePixelRatio)];
}

/**
 * Check if passive event listeners are supported
 */
export function supportsPassiveEvents(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  let supportsPassive = false;
  try {
    const opts = Object.defineProperty({}, 'passive', {
      get: function () {
        supportsPassive = true;
        return true;
      },
    });
    window.addEventListener('testPassive', null as any, opts);
    window.removeEventListener('testPassive', null as any, opts);
  } catch (e) {
    // Passive events not supported
  }
  return supportsPassive;
}

/**
 * Initialize browser compatibility fixes
 * Call this once on app initialization
 */
export function initBrowserCompatibility(): void {
  // Ensure canvas.toBlob is available (Safari polyfill)
  ensureCanvasToBlobSupport();
  
  // Log browser info for debugging
  const browser = detectBrowser();
  const webgl = checkWebGLSupport();
  const localStorage = isLocalStorageAvailable();
  
  console.log('Browser Compatibility Info:', {
    browser: `${browser.name} ${browser.version}`,
    mobile: browser.isMobile,
    iOS: browser.isIOS,
    webgl: webgl.supported ? `WebGL ${webgl.version}` : 'Not supported',
    localStorage: localStorage ? 'Available' : 'Not available',
  });
}
