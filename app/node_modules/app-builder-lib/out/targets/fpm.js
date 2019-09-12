"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _zipBin() {
  const data = require("7zip-bin");

  _zipBin = function () {
    return data;
  };

  return data;
}

function _builderUtil() {
  const data = require("builder-util");

  _builderUtil = function () {
    return data;
  };

  return data;
}

function _fs() {
  const data = require("builder-util/out/fs");

  _fs = function () {
    return data;
  };

  return data;
}

function _fsExtra() {
  const data = require("fs-extra");

  _fsExtra = function () {
    return data;
  };

  return data;
}

var path = _interopRequireWildcard(require("path"));

function _appInfo() {
  const data = require("../appInfo");

  _appInfo = function () {
    return data;
  };

  return data;
}

function _core() {
  const data = require("../core");

  _core = function () {
    return data;
  };

  return data;
}

function errorMessages() {
  const data = _interopRequireWildcard(require("../errorMessages"));

  errorMessages = function () {
    return data;
  };

  return data;
}

function _appBuilder() {
  const data = require("../util/appBuilder");

  _appBuilder = function () {
    return data;
  };

  return data;
}

function _bundledTool() {
  const data = require("../util/bundledTool");

  _bundledTool = function () {
    return data;
  };

  return data;
}

function _macosVersion() {
  const data = require("../util/macosVersion");

  _macosVersion = function () {
    return data;
  };

  return data;
}

function _pathManager() {
  const data = require("../util/pathManager");

  _pathManager = function () {
    return data;
  };

  return data;
}

function _LinuxTargetHelper() {
  const data = require("./LinuxTargetHelper");

  _LinuxTargetHelper = function () {
    return data;
  };

  return data;
}

function _tools() {
  const data = require("./tools");

  _tools = function () {
    return data;
  };

  return data;
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

class FpmTarget extends _core().Target {
  constructor(name, packager, helper, outDir) {
    super(name, false);
    this.packager = packager;
    this.helper = helper;
    this.outDir = outDir;
    this.options = Object.assign({}, this.packager.platformSpecificBuildOptions, this.packager.config[this.name]);
    this.scriptFiles = this.createScripts();
  }

  async createScripts() {
    const defaultTemplatesDir = (0, _pathManager().getTemplatePath)("linux");
    const packager = this.packager;
    const templateOptions = Object.assign({
      // old API compatibility
      executable: packager.executableName,
      productFilename: packager.appInfo.productFilename
    }, packager.platformSpecificBuildOptions);

    function getResource(value, defaultFile) {
      if (value == null) {
        return path.join(defaultTemplatesDir, defaultFile);
      }

      return path.resolve(packager.projectDir, value);
    }

    return await Promise.all([writeConfigFile(packager.info.tempDirManager, getResource(this.options.afterInstall, "after-install.tpl"), templateOptions), writeConfigFile(packager.info.tempDirManager, getResource(this.options.afterRemove, "after-remove.tpl"), templateOptions)]);
  }

  checkOptions() {
    return this.computeFpmMetaInfoOptions();
  }

  async computeFpmMetaInfoOptions() {
    const packager = this.packager;
    const projectUrl = await packager.appInfo.computePackageUrl();
    const errors = [];

    if (projectUrl == null) {
      errors.push("Please specify project homepage, see https://electron.build/configuration/configuration#Metadata-homepage");
    }

    const options = this.options;
    let author = options.maintainer;

    if (author == null) {
      const a = packager.info.metadata.author;

      if (a == null || a.email == null) {
        errors.push(errorMessages().authorEmailIsMissed);
      } else {
        author = `${a.name} <${a.email}>`;
      }
    }

    if (errors.length > 0) {
      throw new Error(errors.join("\n\n"));
    }

    return {
      maintainer: author,
      url: projectUrl,
      vendor: options.vendor || author
    };
  }

  async build(appOutDir, arch) {
    const target = this.name; // tslint:disable:no-invalid-template-strings

    let nameFormat = "${name}-${version}-${arch}.${ext}";
    let isUseArchIfX64 = false;

    if (target === "deb") {
      nameFormat = "${name}_${version}_${arch}.${ext}";
      isUseArchIfX64 = true;
    } else if (target === "rpm") {
      nameFormat = "${name}-${version}.${arch}.${ext}";
      isUseArchIfX64 = true;
    }

    const packager = this.packager;
    const artifactPath = path.join(this.outDir, packager.expandArtifactNamePattern(this.options, target, arch, nameFormat, !isUseArchIfX64));
    await packager.info.callArtifactBuildStarted({
      targetPresentableName: target,
      file: artifactPath,
      arch
    });
    await (0, _fs().unlinkIfExists)(artifactPath);

    if (packager.packagerOptions.prepackaged != null) {
      await (0, _fsExtra().ensureDir)(this.outDir);
    }

    const scripts = await this.scriptFiles;
    const appInfo = packager.appInfo;
    const options = this.options;
    const synopsis = options.synopsis;
    const args = ["--architecture", (0, _builderUtil().toLinuxArchString)(arch, target), "--name", appInfo.linuxPackageName, "--after-install", scripts[0], "--after-remove", scripts[1], "--description", (0, _appInfo().smarten)(target === "rpm" ? this.helper.getDescription(options) : `${synopsis || ""}\n ${this.helper.getDescription(options)}`), "--version", appInfo.version, "--package", artifactPath];
    (0, _appBuilder().objectToArgs)(args, (await this.computeFpmMetaInfoOptions()));
    const packageCategory = options.packageCategory;

    if (packageCategory != null) {
      args.push("--category", packageCategory);
    }

    if (target === "deb") {
      (0, _builderUtil().use)(options.priority, it => args.push("--deb-priority", it));
    } else if (target === "rpm") {
      if (synopsis != null) {
        args.push("--rpm-summary", (0, _appInfo().smarten)(synopsis));
      }
    }

    const fpmConfiguration = {
      args,
      target
    };

    if (options.compression != null) {
      fpmConfiguration.compression = options.compression;
    } // noinspection JSDeprecatedSymbols


    const depends = options.depends;

    if (depends != null) {
      if (Array.isArray(depends)) {
        fpmConfiguration.customDepends = depends;
      } else {
        // noinspection SuspiciousTypeOfGuard
        if (typeof depends === "string") {
          fpmConfiguration.customDepends = [depends];
        } else {
          throw new Error(`depends must be Array or String, but specified as: ${depends}`);
        }
      }
    }

    (0, _builderUtil().use)(packager.info.metadata.license, it => args.push("--license", it));
    (0, _builderUtil().use)(appInfo.buildNumber, it => args.push("--iteration", it));
    (0, _builderUtil().use)(options.fpm, it => args.push(...it));
    args.push(`${appOutDir}/=${_LinuxTargetHelper().installPrefix}/${appInfo.productFilename}`);

    for (const icon of await this.helper.icons) {
      const extWithDot = path.extname(icon.file);
      const sizeName = extWithDot === ".svg" ? "scalable" : `${icon.size}x${icon.size}`;
      args.push(`${icon.file}=/usr/share/icons/hicolor/${sizeName}/apps/${packager.executableName}${extWithDot}`);
    }

    const mimeTypeFilePath = await this.helper.mimeTypeFiles;

    if (mimeTypeFilePath != null) {
      args.push(`${mimeTypeFilePath}=/usr/share/mime/packages/${packager.executableName}.xml`);
    }

    const desktopFilePath = await this.helper.writeDesktopEntry(this.options);
    args.push(`${desktopFilePath}=/usr/share/applications/${packager.executableName}.desktop`);

    if (packager.packagerOptions.effectiveOptionComputed != null && (await packager.packagerOptions.effectiveOptionComputed([args, desktopFilePath]))) {
      return;
    }

    const env = Object.assign({}, process.env, {
      SZA_PATH: _zipBin().path7za,
      SZA_COMPRESSION_LEVEL: packager.compression === "store" ? "0" : "9"
    }); // rpmbuild wants directory rpm with some default config files. Even if we can use dylibbundler, path to such config files are not changed (we need to replace in the binary)
    // so, for now, brew install rpm is still required.

    if (target !== "rpm" && (await (0, _macosVersion().isMacOsSierra)())) {
      const linuxToolsPath = await (0, _tools().getLinuxToolsPath)();
      Object.assign(env, {
        PATH: (0, _bundledTool().computeEnv)(process.env.PATH, [path.join(linuxToolsPath, "bin")]),
        DYLD_LIBRARY_PATH: (0, _bundledTool().computeEnv)(process.env.DYLD_LIBRARY_PATH, [path.join(linuxToolsPath, "lib")])
      });
    }

    await (0, _builderUtil().executeAppBuilder)(["fpm", "--configuration", JSON.stringify(fpmConfiguration)], undefined, {
      env
    });
    await packager.dispatchArtifactCreated(artifactPath, this, arch);
  }

}

exports.default = FpmTarget;

async function writeConfigFile(tmpDir, templatePath, options) {
  //noinspection JSUnusedLocalSymbols
  function replacer(match, p1) {
    if (p1 in options) {
      return options[p1];
    } else {
      throw new Error(`Macro ${p1} is not defined`);
    }
  }

  const config = (await (0, _fsExtra().readFile)(templatePath, "utf8")).replace(/\${([a-zA-Z]+)}/g, replacer).replace(/<%=([a-zA-Z]+)%>/g, (match, p1) => {
    _builderUtil().log.warn("<%= varName %> is deprecated, please use ${varName} instead");

    return replacer(match, p1.trim());
  });
  const outputPath = await tmpDir.getTempFile({
    suffix: path.basename(templatePath, ".tpl")
  });
  await (0, _fsExtra().outputFile)(outputPath, config);
  return outputPath;
} 
// __ts-babel@6.0.4
//# sourceMappingURL=fpm.js.map