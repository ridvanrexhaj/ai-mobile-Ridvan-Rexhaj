const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer = {
  ...config.transformer,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: false,
    },
  }),
};

config.resolver = {
  ...config.resolver,
  assetExts: [
    ...config.resolver.assetExts,
    'png',
    'jpg',
    'jpeg',
    'gif',
    'svg',
  ],
};

module.exports = config;
