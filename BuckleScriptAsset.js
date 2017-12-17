/**
 * Original implement copied from https://github.com/reasonml-community/bs-loader/blob/master/packages/bs-loader/index.js
 */
const path = require('path');
const JSAsset = require('parcel-bundler/src/assets/JSAsset');
const { readBsConfig } = require('read-bsconfig');
const { compileFile } = require('bsb-js');

const outputDir = 'lib';
const fileNameRegex = /\.(ml|re)$/;

async function getBsConfigModuleOptions(buildDir) {
  return await readBsConfig(buildDir).then(bsconfig => {
    if (!bsconfig) {
      throw new Error(`bsconfig not found in ${buildDir}`);
    }

    const bsSuffix = bsconfig.suffix;
    const suffix = typeof bsSuffix === 'string' ? bsSuffix : '.js';

    if (!bsconfig['package-specs'] || !bsconfig['package-specs'].length) {
      const options = {
        moduleDir: 'js',
        inSource: false,
        suffix,
      };
      return options;
    }

    const moduleSpec = bsconfig['package-specs'][0];
    const moduleDir =
      typeof moduleSpec === 'string' ? moduleSpec : moduleSpec.module;
    const inSource =
      typeof moduleSpec === 'string' ? false : moduleSpec['in-source'];

    const options = { moduleDir, inSource, suffix };
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
    const { moduleDir, suffix, inSource = false } = bsconfig;
    const compiledFilePath = jsFilePath(
      buildDir,
      moduleDir,
      this.name,
      inSource,
      suffix
    );
    const compiled = await compileFile(
      buildDir,
      moduleDir,
      compiledFilePath
    );
    const { src, warnings, errors } = compiled;

    if (warnings.length) console.warn('warnings', warnings.join('\n'));
    if (errors.length) throw new Error(errors.join('\n'));

    this.contents = src;

    return await super.parse(this.contents);
  }
}

module.exports = BuckleScriptAsset;