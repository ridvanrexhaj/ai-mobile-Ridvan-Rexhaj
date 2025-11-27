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
    // Ignore resolution errors for missing assets in node_modules
    disableHierarchicalLookup: false,
  },
  maxWorkers: 2,
  watchFolders: [__dirname],
};
