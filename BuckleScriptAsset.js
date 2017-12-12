const { compile } = require('svelte');
const JSAsset = require('parcel-bundler/src/assets/JSAsset');

class BuckleScriptAsset extends JSAsset {
  parse(code) {
    const options = {
      generate: 'dom',
      format: 'cjs'
    };

    const compiled = compile(code, options);
    this.contents = compiled.code;
    super.parse(this.contents);
  }
}

module.exports = BuckleScriptAsset;