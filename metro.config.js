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
    ...config.resolver.assetExts.filter(ext => ext !== 'png'),
    'png',
    'jpg',
    'jpeg',
    'gif',
    'svg',
    'webp',
  ],
  extraNodeModules: {
    '@react-navigation/elements': require.resolve('@react-navigation/elements'),
  },
};

module.exports = config;
