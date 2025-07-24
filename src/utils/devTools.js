import { ENV } from '../config';
import performanceService from '../services/performanceService';

class DevTools {
  constructor() {
    this.isEnabled = ENV.IS_DEVELOPMENT;
    this.logs = [];
    this.maxLogs = 100;
  }

  log(message, data = null, type = 'info') {
    if (!this.isEnabled) return;

    const logEntry = {
      timestamp: new Date().toISOString(),
      message,
      data,
      type,
      stack: new Error().stack
    };

    this.logs.push(logEntry);
    
    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output with styling
    const styles = {
      info: 'color: #0284c7',
      warn: 'color: #d97706',
      error: 'color: #dc2626',
      success: 'color: #059669'
    };

    console.log(
      `%c[DevTools] ${message}`,
      styles[type] || styles.info,
      data || ''
    );
  }

  warn(message, data) {
    this.log(message, data, 'warn');
  }

  error(message, data) {
    this.log(message, data, 'error');
  }

  success(message, data) {
    this.log(message, data, 'success');
  }

  // Performance monitoring
  startTimer(name) {
    if (!this.isEnabled) return;
    performanceService.startMeasure(name);
  }

  endTimer(name) {
    if (!this.isEnabled) return;
    performanceService.endMeasure(name);
  }

  // Component render tracking
  trackRender(componentName, props = {}) {
    if (!this.isEnabled) return;
    
    this.log(`Component rendered: ${componentName}`, {
      props: Object.keys(props),
      timestamp: Date.now()
    });
  }

  // State change tracking
  trackStateChange(stateName, oldValue, newValue) {
    if (!this.isEnabled) return;
    
    this.log(`State changed: ${stateName}`, {
      from: oldValue,
      to: newValue
    });
  }

  // API call tracking
  trackApiCall(endpoint, method, duration) {
    if (!this.isEnabled) return;
    
    this.log(`API call: ${method} ${endpoint}`, {
      duration: `${duration}ms`,
      timestamp: Date.now()
    });
  }

  // Get all logs
  getLogs() {
    return this.logs;
  }

  // Clear logs
  clearLogs() {
    this.logs = [];
    this.log('Logs cleared');
  }

  // Export logs
  exportLogs() {
    if (!this.isEnabled) return;
    
    const dataStr = JSON.stringify(this.logs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `vitech-logs-${Date.now()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  }

  // Add to window for debugging
  exposeToWindow() {
    if (!this.isEnabled) return;
    
    window.devTools = {
      logs: () => this.getLogs(),
      clearLogs: () => this.clearLogs(),
      exportLogs: () => this.exportLogs(),
      performance: () => performanceService.getMetrics(),
      memory: () => performanceService.getMemoryUsage()
    };
    
    this.log('DevTools exposed to window.devTools');
  }
}

export default new DevTools();