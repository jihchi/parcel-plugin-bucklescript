const JSAsset = require('parcel-bundler/src/assets/JSAsset');
const { readBsConfig } = require('read-bsconfig');
const { compileFile } = require('bsb-js');

// TODO: Implement integration with BuckleScript
const compile = id => id;

async function getBsConfigModuleOptions(buildDir) {
  return await readBsConfig(buildDir).then(bsconfig => {
    if (!bsconfig) {
      throw new Error(`bsconfig not found in ${buildDir}`);
    }

    const bsSuffix = bsconfig.suffix;
    const suffix = typeof bsSuffix === 'string' ? bsSuffix : '.js';

    if (!bsconfig['package-specs'] || !bsconfig['package-specs'].length) {
      const options: Options = {
        moduleDir: 'js',
        inSource: false,
        suffix,
      };
      return options;
    }

    const moduleSpec = bsconfig['package-specs'][0];
    const moduleDir: BsModuleFormat =
      typeof moduleSpec === 'string' ? moduleSpec : moduleSpec.module;
    const inSource =
      typeof moduleSpec === 'string' ? false : moduleSpec['in-source'];

    const options: Options = { moduleDir, inSource, suffix };
    return options;
  });
}

function jsFilePath(buildDir, moduleDir, resourcePath, inSource, bsSuffix) {
  const mlFileName = resourcePath.replace(buildDir, '');
  const jsFileName = mlFileName.replace(fileNameRegex, '.js');

  if (inSource) {
    return path.join(buildDir, jsFileName);
  }

  return path.join(buildDir, outputDir, moduleDir, jsFileName);
}

class BuckleScriptAsset extends JSAsset {
  async parse(code) {
    const buildDir = process.cwd();
    const bsconfig = await getBsConfigModuleOptions(buildDir);
    const moduleDir = bsconfig.moduleDir;
    const bsSuffix = bsconfig.suffix;
    const inSourceBuild = options.inSource || bsconfig.inSource || false;
    const resourcePath = '.';
    const compiledFilePath = jsFilePath(
      buildDir,
      moduleDir,
      resourcePath,
      inSourceBuild,
      bsSuffix
    );
    const compiled = await compileFile(buildDir, moduleDir, compiledFilePath);

    this.contents = compiled.code;

    return await super.parse(this.contents);
  }
}

module.exports = BuckleScriptAsset;