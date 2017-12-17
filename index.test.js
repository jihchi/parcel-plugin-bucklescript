const Bundler = require('parcel-bundler');

it('should compile reason file', async () => {
  const bundler = new Bundler('./example/index.html');

  bundler.addAssetType('re', require.resolve('./BuckleScriptAsset'));
  bundler.addAssetType('ml', require.resolve('./BuckleScriptAsset'));

  await bundler.bundle();
  await bundler.stop();
});


