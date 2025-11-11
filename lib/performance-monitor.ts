/**
 * Performance monitoring utilities for tracking frame rate and render performance
 */

export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  averageFps: number;
  minFps: number;
  maxFps: number;
}

export class PerformanceMonitor {
  private frames: number = 0;
  private lastTime: number = performance.now();
  private fpsHistory: number[] = [];
  private maxHistorySize: number = 60; // Track last 60 frames
  private currentFps: number = 0;
  private isMonitoring: boolean = false;
  private animationFrameId: number | null = null;
  private onUpdate?: (metrics: PerformanceMetrics) => void;

  constructor(onUpdate?: (metrics: PerformanceMetrics) => void) {
    this.onUpdate = onUpdate;
  }

  /**
   * Start monitoring performance
   */
  start(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    this.frames = 0;
    this.lastTime = performance.now();
    this.fpsHistory = [];
    
    this.measure();
  }

  /**
   * Stop monitoring performance
   */
  stop(): void {
    this.isMonitoring = false;
    
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Measure frame rate
   */
  private measure = (): void => {
    if (!this.isMonitoring) return;

    this.frames++;
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;

    // Update FPS every second
    if (deltaTime >= 1000) {
      this.currentFps = Math.round((this.frames * 1000) / deltaTime);
      
      // Add to history
      this.fpsHistory.push(this.currentFps);
      
      // Limit history size
      if (this.fpsHistory.length > this.maxHistorySize) {
        this.fpsHistory.shift();
      }

      // Calculate metrics
      const metrics = this.getMetrics();
      
      // Log performance warnings
      if (metrics.fps < 30) {
        console.warn(`Low FPS detected: ${metrics.fps} fps`);
      }
      
      // Call update callback
      if (this.onUpdate) {
        this.onUpdate(metrics);
      }

      // Reset counters
      this.frames = 0;
      this.lastTime = currentTime;
    }

    // Continue measuring
    this.animationFrameId = requestAnimationFrame(this.measure);
  };

  /**
   * Get current performance metrics
   */
  getMetrics(): PerformanceMetrics {
    const fps = this.currentFps;
    const frameTime = fps > 0 ? 1000 / fps : 0;
    
    const averageFps = this.fpsHistory.length > 0
      ? Math.round(this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length)
      : fps;
    
    const minFps = this.fpsHistory.length > 0
      ? Math.min(...this.fpsHistory)
      : fps;
    
    const maxFps = this.fpsHistory.length > 0
      ? Math.max(...this.fpsHistory)
      : fps;

    return {
      fps,
      frameTime,
      averageFps,
      minFps,
      maxFps,
    };
  }

  /**
   * Reset all metrics
   */
  reset(): void {
    this.frames = 0;
    this.lastTime = performance.now();
    this.fpsHistory = [];
    this.currentFps = 0;
  }

  /**
   * Check if performance meets target
   */
  meetsTarget(targetFps: number = 30): boolean {
    const metrics = this.getMetrics();
    return metrics.averageFps >= targetFps;
  }
}

/**
 * Create a performance monitor instance
 */
export function createPerformanceMonitor(
  onUpdate?: (metrics: PerformanceMetrics) => void
): PerformanceMonitor {
  return new PerformanceMonitor(onUpdate);
}

/**
 * Hook for monitoring performance in development
 */
export function logPerformanceMetrics(monitor: PerformanceMonitor): void {
  const metrics = monitor.getMetrics();
  
  console.log('Performance Metrics:', {
    'Current FPS': metrics.fps,
    'Average FPS': metrics.averageFps,
    'Min FPS': metrics.minFps,
    'Max FPS': metrics.maxFps,
    'Frame Time': `${metrics.frameTime.toFixed(2)}ms`,
    'Meets 30fps Target': monitor.meetsTarget(30) ? '✓' : '✗',
    'Meets 60fps Target': monitor.meetsTarget(60) ? '✓' : '✗',
  });
}
