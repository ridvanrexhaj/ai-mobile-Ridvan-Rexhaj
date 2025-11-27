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
      'png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'weba',
      'otf', 'ttf', 'ttx', 'font', 'zip', 'md'
    ],
    sourceExts: ['js', 'jsx', 'ts', 'tsx', 'json'],
    // Handle missing assets from @react-navigation/elements
    blockList: [/node_modules\/.*\/\..*/],
  },
};
