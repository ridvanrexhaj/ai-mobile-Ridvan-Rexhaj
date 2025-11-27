const path = require('path');

module.exports = {
  projectRoot: __dirname,
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  resolver: {
    assetExts: [
      'png', 'jpg', 'jpeg', 'gif', 'svg', 'webp',
      'otf', 'ttf', 'ttx', 'font', 'zip', 'md'
    ],
    sourceExts: ['js', 'jsx', 'ts', 'tsx', 'json'],
  },
};
