"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _builderUtil() {
  const data = require("builder-util");

  _builderUtil = function () {
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

function _lazyVal() {
  const data = require("lazy-val");

  _lazyVal = function () {
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

function _PublishManager() {
  const data = require("../publish/PublishManager");

  _PublishManager = function () {
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

function _license() {
  const data = require("../util/license");

  _license = function () {
    return data;
  };

  return data;
}

function _targetUtil() {
  const data = require("./targetUtil");

  _targetUtil = function () {
    return data;
  };

  return data;
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

// https://unix.stackexchange.com/questions/375191/append-to-sub-directory-inside-squashfs-file
class AppImageTarget extends _core().Target {
  constructor(ignored, packager, helper, outDir) {
    super("appImage");
    this.packager = packager;
    this.helper = helper;
    this.outDir = outDir;
    this.options = Object.assign({}, this.packager.platformSpecificBuildOptions, this.packager.config[this.name]);
    this.desktopEntry = new (_lazyVal().Lazy)(() => helper.computeDesktopEntry(this.options, "AppRun", {
      "X-AppImage-Version": `${packager.appInfo.buildVersion}`
    }));
  }

  async build(appOutDir, arch) {
    const packager = this.packager;
    const options = this.options; // https://github.com/electron-userland/electron-builder/issues/775
    // https://github.com/electron-userland/electron-builder/issues/1726
    // tslint:disable-next-line:no-invalid-template-strings

    const artifactName = packager.expandArtifactNamePattern(options, "AppImage", arch);
    const artifactPath = path.join(this.outDir, artifactName);
    await packager.info.callArtifactBuildStarted({
      targetPresentableName: "AppImage",
      file: artifactPath,
      arch
    });
    const c = await Promise.all([this.desktopEntry.value, this.helper.icons, (0, _PublishManager().getAppUpdatePublishConfiguration)(packager, arch, false
    /* in any case validation will be done on publish */
    ), (0, _license().getNotLocalizedLicenseFile)(options.license, this.packager, ["txt", "html"]), (0, _targetUtil().createStageDir)(this, packager, arch)]);
    const license = c[3];
    const stageDir = c[4];
    const publishConfig = c[2];

    if (publishConfig != null) {
      await (0, _fsExtra().outputFile)(path.join(packager.getResourcesDir(stageDir.dir), "app-update.yml"), (0, _builderUtil().serializeToYaml)(publishConfig));
    }

    if (this.packager.packagerOptions.effectiveOptionComputed != null && (await this.packager.packagerOptions.effectiveOptionComputed({
      desktop: await this.desktopEntry.value
    }))) {
      return;
    }

    const args = ["appimage", "--stage", stageDir.dir, "--arch", _builderUtil().Arch[arch], "--output", artifactPath, "--app", appOutDir, "--configuration", JSON.stringify(Object.assign({
      productName: this.packager.appInfo.productName,
      productFilename: this.packager.appInfo.productFilename,
      desktopEntry: c[0],
      executableName: this.packager.executableName,
      icons: c[1],
      fileAssociations: this.packager.fileAssociations
    }, options))];
    (0, _appBuilder().objectToArgs)(args, {
      license
    });

    if (packager.compression === "maximum") {
      args.push("--compression", "xz");
    }

    await packager.info.callArtifactBuildCompleted({
      file: artifactPath,
      safeArtifactName: packager.computeSafeArtifactName(artifactName, "AppImage", arch, false),
      target: this,
      arch,
      packager,
      isWriteUpdateInfo: true,
      updateInfo: await (0, _appBuilder().executeAppBuilderAsJson)(args)
    });
  }

} exports.default = AppImageTarget;
// __ts-babel@6.0.4
//# sourceMappingURL=AppImageTarget.js.map