const fs = require('fs');
const path = require('path');

// Generate build information
const buildInfo = {
  version: process.env.npm_package_version || '1.0.0',
  buildTime: new Date().toISOString(),
  nodeVersion: process.version,
  environment: process.env.NODE_ENV || 'development',
  gitCommit: process.env.REACT_APP_GIT_COMMIT || 'unknown',
  gitBranch: process.env.REACT_APP_GIT_BRANCH || 'unknown'
};

// Write build info to public folder
const buildInfoPath = path.join(__dirname, '../public/build-info.json');
fs.writeFileSync(buildInfoPath, JSON.stringify(buildInfo, null, 2));

console.log('Build info generated:', buildInfo);

// Write to src for runtime access
const srcBuildInfoPath = path.join(__dirname, '../src/build-info.json');
fs.writeFileSync(srcBuildInfoPath, JSON.stringify(buildInfo, null, 2));

console.log('Build info written to:', srcBuildInfoPath);