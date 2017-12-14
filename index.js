module.exports = function(bundler) {
  bundler.addAssetType('re', require.resolve('./BuckleScriptAsset'));
  bundler.addAssetType('ml', require.resolve('./BuckleScriptAsset'));
};