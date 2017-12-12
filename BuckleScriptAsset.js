const JSAsset = require('parcel-bundler/src/assets/JSAsset');

// TODO: Implement integration with BuckleScript
const compile = id => id;

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