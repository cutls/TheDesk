"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ArchiveTarget = void 0;

function _builderUtil() {
  const data = require("builder-util");

  _builderUtil = function () {
    return data;
  };

  return data;
}

var path = _interopRequireWildcard(require("path"));

function _core() {
  const data = require("../core");

  _core = function () {
    return data;
  };

  return data;
}

function _fileMatcher() {
  const data = require("../fileMatcher");

  _fileMatcher = function () {
    return data;
  };

  return data;
}

function _archive() {
  const data = require("./archive");

  _archive = function () {
    return data;
  };

  return data;
}

function _differentialUpdateInfoBuilder() {
  const data = require("./differentialUpdateInfoBuilder");

  _differentialUpdateInfoBuilder = function () {
    return data;
  };

  return data;
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

class ArchiveTarget extends _core().Target {
  constructor(name, outDir, packager, isWriteUpdateInfo = false) {
    super(name);
    this.outDir = outDir;
    this.packager = packager;
    this.isWriteUpdateInfo = isWriteUpdateInfo;
    this.options = this.packager.config[this.name];
  }

  async build(appOutDir, arch) {
    const packager = this.packager;

    const isMac = packager.platform === _core().Platform.MAC;

    const format = this.name;
    let defaultPattern;

    if (packager.platform === _core().Platform.LINUX) {
      // tslint:disable-next-line:no-invalid-template-strings
      defaultPattern = "${name}-${version}" + (arch === _builderUtil().Arch.x64 ? "" : "-${arch}") + ".${ext}";
    } else {
      // tslint:disable-next-line:no-invalid-template-strings
      defaultPattern = "${productName}-${version}" + (arch === _builderUtil().Arch.x64 ? "" : "-${arch}") + "-${os}.${ext}";
    }

    const artifactName = packager.expandArtifactNamePattern(this.options, format, arch, defaultPattern, false);
    const artifactPath = path.join(this.outDir, artifactName);
    await packager.info.callArtifactBuildStarted({
      targetPresentableName: `${isMac ? "macOS " : ""}${format}`,
      file: artifactPath,
      arch
    });
    let updateInfo = null;

    if (format.startsWith("tar.")) {
      await (0, _archive().tar)(packager.compression, format, artifactPath, appOutDir, isMac, packager.info.tempDirManager);
    } else {
      let withoutDir = !isMac;
      let dirToArchive = appOutDir;

      if (isMac) {
        dirToArchive = path.dirname(appOutDir);
        const fileMatchers = (0, _fileMatcher().getFileMatchers)(packager.config, "extraDistFiles", dirToArchive, packager.createGetFileMatchersOptions(this.outDir, arch, packager.platformSpecificBuildOptions));

        if (fileMatchers == null) {
          dirToArchive = appOutDir;
        } else {
          await (0, _fileMatcher().copyFiles)(fileMatchers, null, true);
          withoutDir = true;
        }
      }

      const archiveOptions = {
        compression: packager.compression,
        withoutDir
      };
      await (0, _archive().archive)(format, artifactPath, dirToArchive, archiveOptions);

      if (this.isWriteUpdateInfo && format === "zip") {
        updateInfo = await (0, _differentialUpdateInfoBuilder().appendBlockmap)(artifactPath);
      }
    }

    await packager.info.callArtifactBuildCompleted({
      updateInfo,
      file: artifactPath,
      // tslint:disable-next-line:no-invalid-template-strings
      safeArtifactName: packager.computeSafeArtifactName(artifactName, format, arch, false, defaultPattern.replace("${productName}", "${name}")),
      target: this,
      arch,
      packager,
      isWriteUpdateInfo: this.isWriteUpdateInfo
    });
  }

} exports.ArchiveTarget = ArchiveTarget;
// __ts-babel@6.0.4
//# sourceMappingURL=ArchiveTarget.js.map