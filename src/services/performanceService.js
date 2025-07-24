class PerformanceService {
  constructor() {
    this.metrics = new Map();
    this.observers = [];
  }

  // Start measuring performance
  startMeasure(name) {
    if (typeof performance !== 'undefined') {
      performance.mark(`${name}-start`);
    }
  }

  // End measuring performance
  endMeasure(name) {
    if (typeof performance !== 'undefined') {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
      
      const measure = performance.getEntriesByName(name)[0];
      this.metrics.set(name, measure.duration);
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`${name}: ${measure.duration.toFixed(2)}ms`);
      }
      
      // Clean up marks
      performance.clearMarks(`${name}-start`);
      performance.clearMarks(`${name}-end`);
      performance.clearMeasures(name);
    }
  }

  // Get all metrics
  getMetrics() {
    return Object.fromEntries(this.metrics);
  }

  // Monitor component render time
  measureComponent(componentName, renderFn) {
    return (...args) => {
      this.startMeasure(`component-${componentName}`);
      const result = renderFn(...args);
      this.endMeasure(`component-${componentName}`);
      return result;
    };
  }

  // Monitor async operations
  async measureAsync(name, asyncFn) {
    this.startMeasure(name);
    try {
      const result = await asyncFn();
      this.endMeasure(name);
      return result;
    } catch (error) {
      this.endMeasure(name);
      throw error;
    }
  }

  // Monitor memory usage
  getMemoryUsage() {
    if (performance.memory) {
      return {
        usedJSHeapSize: Math.round(performance.memory.usedJSHeapSize / 1048576),
        totalJSHeapSize: Math.round(performance.memory.totalJSHeapSize / 1048576),
        jsHeapSizeLimit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
      };
    }
    return null;
  }

  // Log performance summary
  logSummary() {
    if (process.env.NODE_ENV === 'development') {
      console.group('Performance Summary');
      console.table(this.getMetrics());
      
      const memory = this.getMemoryUsage();
      if (memory) {
        console.log('Memory Usage (MB):', memory);
      }
      
      console.groupEnd();
    }
  }
}

export default new PerformanceService();