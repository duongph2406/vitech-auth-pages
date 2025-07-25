/**
 * Performance monitoring component for development
 */

import { useState, useEffect } from 'react';
import './PerformanceMonitor.css';

const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    memoryUsage: 0,
    componentCount: 0
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') return;

    const updateMetrics = () => {
      // Get performance metrics
      const navigation = performance.getEntriesByType('navigation')[0];
      const memory = performance.memory;
      
      setMetrics({
        renderTime: navigation ? Math.round(navigation.loadEventEnd - navigation.loadEventStart) : 0,
        memoryUsage: memory ? Math.round(memory.usedJSHeapSize / 1024 / 1024) : 0,
        componentCount: document.querySelectorAll('[data-reactroot] *').length
      });
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 1000);

    return () => clearInterval(interval);
  }, []);

  // Don't render in production
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className={`performance-monitor ${isVisible ? 'visible' : ''}`}>
      <button 
        className="performance-toggle"
        onClick={() => setIsVisible(!isVisible)}
        title="Performance Monitor"
      >
        📊
      </button>
      
      {isVisible && (
        <div className="performance-panel">
          <h4>Performance Metrics</h4>
          <div className="metric">
            <span>Render Time:</span>
            <span>{metrics.renderTime}ms</span>
          </div>
          <div className="metric">
            <span>Memory Usage:</span>
            <span>{metrics.memoryUsage}MB</span>
          </div>
          <div className="metric">
            <span>DOM Nodes:</span>
            <span>{metrics.componentCount}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceMonitor;