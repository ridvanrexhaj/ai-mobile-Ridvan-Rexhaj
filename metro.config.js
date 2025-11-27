let getDefaultConfig;
try {
  getDefaultConfig = require('expo/metro-config').getDefaultConfig;
} catch (e) {
  // Fallback for environments that don't support metro-config
  module.exports = {};
}

if (getDefaultConfig) {
  const config = getDefaultConfig(__dirname);
  module.exports = config;
}
