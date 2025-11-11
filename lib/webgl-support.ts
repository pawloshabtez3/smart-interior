/**
 * Detect WebGL support in the browser
 * @returns true if WebGL is supported, false otherwise
 */
export function detectWebGLSupport(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch (e) {
    console.error('WebGL detection failed:', e);
    return false;
  }
}

/**
 * Get WebGL support details
 * @returns Object with support status and details
 */
export function getWebGLInfo(): {
  supported: boolean;
  version?: string;
  renderer?: string;
  vendor?: string;
} {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      return { supported: false };
    }

    const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info');
    
    return {
      supported: true,
      version: (gl as any).getParameter((gl as any).VERSION),
      renderer: debugInfo ? (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : undefined,
      vendor: debugInfo ? (gl as any).getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : undefined,
    };
  } catch (e) {
    console.error('Failed to get WebGL info:', e);
    return { supported: false };
  }
}
