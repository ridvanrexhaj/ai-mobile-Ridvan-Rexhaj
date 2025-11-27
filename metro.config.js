module.exports = {
  project: {
    ios: {},
    android: {},
    web: {},
  },
  resolver: {
    assetExts: ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'],
    sourceExts: ['js', 'jsx', 'ts', 'tsx', 'json'],
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
};
