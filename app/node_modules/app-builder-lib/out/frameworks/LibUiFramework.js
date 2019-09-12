"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LibUiFramework = void 0;

function _fsExtra() {
  const data = require("fs-extra");

  _fsExtra = function () {
    return data;
  };

  return data;
}

var path = _interopRequireWildcard(require("path"));

function _builderUtil() {
  const data = require("builder-util");

  _builderUtil = function () {
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

function _appBuilder() {
  const data = require("../util/appBuilder");

  _appBuilder = function () {
    return data;
  };

  return data;
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

class LibUiFramework {
  constructor(version, distMacOsAppName, isUseLaunchUi) {
    this.version = version;
    this.distMacOsAppName = distMacOsAppName;
    this.isUseLaunchUi = isUseLaunchUi;
    this.name = "libui"; // noinspection JSUnusedGlobalSymbols

    this.macOsDefaultTargets = ["dmg"];
    this.defaultAppIdPrefix = "com.libui."; // noinspection JSUnusedGlobalSymbols

    this.isCopyElevateHelper = false; // noinspection JSUnusedGlobalSymbols

    this.isNpmRebuildRequired = false;
  }

  async prepareApplicationStageDirectory(options) {
    await (0, _fsExtra().emptyDir)(options.appOutDir);
    const packager = options.packager;
    const platform = packager.platform;

    if (this.isUseLaunchUiForPlatform(platform)) {
      const appOutDir = options.appOutDir;
      await (0, _builderUtil().executeAppBuilder)(["proton-native", "--node-version", this.version, "--use-launch-ui", "--platform", platform.nodeName, "--arch", options.arch, "--stage", appOutDir, "--executable", `${packager.appInfo.productFilename}${platform === _core().Platform.WINDOWS ? ".exe" : ""}`]);
      return;
    }

    if (platform === _core().Platform.MAC) {
      await this.prepareMacosApplicationStageDirectory(packager, options);
    } else if (platform === _core().Platform.LINUX) {
      await this.prepareLinuxApplicationStageDirectory(options);
    }
  }

  async prepareMacosApplicationStageDirectory(packager, options) {
    const appContentsDir = path.join(options.appOutDir, this.distMacOsAppName, "Contents");
    await (0, _fsExtra().ensureDir)(path.join(appContentsDir, "Resources"));
    await (0, _fsExtra().ensureDir)(path.join(appContentsDir, "MacOS"));
    await (0, _builderUtil().executeAppBuilder)(["proton-native", "--node-version", this.version, "--platform", "darwin", "--stage", path.join(appContentsDir, "MacOS")]);
    const appPlist = {
      // https://github.com/albe-rosado/create-proton-app/issues/13
      NSHighResolutionCapable: true
    };
    await packager.applyCommonInfo(appPlist, appContentsDir);
    await Promise.all([(0, _appBuilder().executeAppBuilderAndWriteJson)(["encode-plist"], {
      [path.join(appContentsDir, "Info.plist")]: appPlist
    }), writeExecutableMain(path.join(appContentsDir, "MacOS", appPlist.CFBundleExecutable), `#!/bin/sh
  DIR=$(dirname "$0")
  "$DIR/node" "$DIR/../Resources/app/${options.packager.info.metadata.main || "index.js"}"
  `)]);
  }

  async prepareLinuxApplicationStageDirectory(options) {
    const appOutDir = options.appOutDir;
    await (0, _builderUtil().executeAppBuilder)(["proton-native", "--node-version", this.version, "--platform", "linux", "--arch", options.arch, "--stage", appOutDir]);
    const mainPath = path.join(appOutDir, options.packager.executableName);
    await writeExecutableMain(mainPath, `#!/bin/sh
  DIR=$(dirname "$0")
  "$DIR/node" "$DIR/app/${options.packager.info.metadata.main || "index.js"}"
  `);
  }

  async afterPack(context) {
    const packager = context.packager;

    if (!this.isUseLaunchUiForPlatform(packager.platform)) {
      return;
    } // LaunchUI requires main.js, rename if need


    const userMain = packager.info.metadata.main || "index.js";

    if (userMain === "main.js") {
      return;
    }

    await (0, _fsExtra().rename)(path.join(context.appOutDir, "app", userMain), path.join(context.appOutDir, "app", "main.js"));
  }

  getMainFile(platform) {
    return this.isUseLaunchUiForPlatform(platform) ? "main.js" : null;
  }

  isUseLaunchUiForPlatform(platform) {
    return platform === _core().Platform.WINDOWS || this.isUseLaunchUi && platform === _core().Platform.LINUX;
  }

  getExcludedDependencies(platform) {
    // part of launchui
    return this.isUseLaunchUiForPlatform(platform) ? ["libui-node"] : null;
  }

}

exports.LibUiFramework = LibUiFramework;

async function writeExecutableMain(file, content) {
  await (0, _fsExtra().writeFile)(file, content, {
    mode: 0o755
  });
  await (0, _fsExtra().chmod)(file, 0o755);
} 
// __ts-babel@6.0.4
//# sourceMappingURL=LibUiFramework.js.map