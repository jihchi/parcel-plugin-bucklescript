module.exports = function (bundler) {
    bundler.addAssetType('bs', require.resolve('./BuckleScriptAsset'));
};