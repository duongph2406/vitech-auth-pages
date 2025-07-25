/**
 * Enhanced Performance Monitor with detailed metrics
 */

import { useState, useEffect, useRef } from 'react';
import './PerformanceMonitor.css';
import { APP_CONFIG } from '../../lib/constants';

const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    memoryUsage: 0,
    componentCount: 0,
    fps: 0,
    networkRequests: 0,
    cacheHits: 0,
    errorCount: 0
  });
  
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const networkCountRef = useRef(0);
  const errorCountRef = useRef(0);

  useEffect(() => {
    // Only show in development
    if (APP_CONFIG.ENVIRONMENT !== 'development') return;

    const updateMetrics = () => {
      // Performance metrics
      const navigation = performance.getEntriesByType('navigation')[0];
      const memory = performance.memory;
      
      // FPS calculation
      const now = performance.now();
      const delta = now - lastTimeRef.current;
      if (delta >= 1000) {
        const fps = Math.round((frameCountRef.current * 1000) / delta);
        frameCountRef.current = 0;
        lastTimeRef.current = now;
        
        setMetrics(prev => ({ ...prev, fps }));
      }
      frameCountRef.current++;

      // Other metrics
      setMetrics(prev => ({
        ...prev,
        renderTime: navigation ? Math.round(navigation.loadEventEnd - navigation.loadEventStart) : 0,
        memoryUsage: memory ? Math.round(memory.usedJSHeapSize / 1024 / 1024) : 0,
        componentCount: document.querySelectorAll('[data-reactroot] *').length,
        networkRequests: networkCountRef.current,
        errorCount: errorCountRef.current
      }));
    };

    // Monitor network requests
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
      networkCountRef.current++;
      return originalFetch.apply(this, args);
    };

    // Monitor errors
    const errorHandler = () => {
      errorCountRef.current++;
    };
    
    window.addEventListener('error', errorHandler);
    window.addEventListener('unhandledrejection', errorHandler);

    const interval = setInterval(updateMetrics, 1000);
    const animationFrame = () => {
      updateMetrics();
      requestAnimationFrame(animationFrame);
    };
    requestAnimationFrame(animationFrame);

    return () => {
      clearInterval(interval);
      window.fetch = originalFetch;
      window.removeEventListener('error', errorHandler);
      window.removeEventListener('unhandledrejection', errorHandler);
    };
  }, []);

  // Don't render in production
  if (APP_CONFIG.ENVIRONMENT !== 'development') return null;

  const getPerformanceColor = (value, thresholds) => {
    if (value <= thresholds.good) return '#10b981';
    if (value <= thresholds.warning) return '#f59e0b';
    return '#ef4444';
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

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
        <div className={`performance-panel ${isExpanded ? 'expanded' : ''}`}>
          <div className="performance-header">
            <h4>Performance</h4>
            <button 
              className="expand-btn"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? '−' : '+'}
            </button>
          </div>
          
          <div className="metrics-grid">
            <div className="metric">
              <span className="metric-label">FPS:</span>
              <span 
                className="metric-value"
                style={{ color: getPerformanceColor(60 - metrics.fps, { good: 10, warning: 20 }) }}
              >
                {metrics.fps}
              </span>
            </div>
            
            <div className="metric">
              <span className="metric-label">Memory:</span>
              <span 
                className="metric-value"
                style={{ color: getPerformanceColor(metrics.memoryUsage, { good: 50, warning: 100 }) }}
              >
                {metrics.memoryUsage}MB
              </span>
            </div>
            
            {isExpanded && (
              <>
                <div className="metric">
                  <span className="metric-label">Render:</span>
                  <span className="metric-value">{metrics.renderTime}ms</span>
                </div>
                
                <div className="metric">
                  <span className="metric-label">DOM:</span>
                  <span className="metric-value">{metrics.componentCount}</span>
                </div>
                
                <div className="metric">
                  <span className="metric-label">Network:</span>
                  <span className="metric-value">{metrics.networkRequests}</span>
                </div>
                
                <div className="metric">
                  <span className="metric-label">Errors:</span>
                  <span 
                    className="metric-value"
                    style={{ color: metrics.errorCount > 0 ? '#ef4444' : '#10b981' }}
                  >
                    {metrics.errorCount}
                  </span>
                </div>
              </>
            )}
          </div>
          
          {isExpanded && (
            <div className="performance-actions">
              <button 
                className="action-btn"
                onClick={() => {
                  networkCountRef.current = 0;
                  errorCountRef.current = 0;
                }}
              >
                Reset
              </button>
              <button 
                className="action-btn"
                onClick={() => {
                  console.log('Performance Metrics:', metrics);
                }}
              >
                Log
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PerformanceMonitor;