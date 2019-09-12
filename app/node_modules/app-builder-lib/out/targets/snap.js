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

function _builderUtilRuntime() {
  const data = require("builder-util-runtime");

  _builderUtilRuntime = function () {
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

function _jsYaml() {
  const data = require("js-yaml");

  _jsYaml = function () {
    return data;
  };

  return data;
}

var path = _interopRequireWildcard(require("path"));

function semver() {
  const data = _interopRequireWildcard(require("semver"));

  semver = function () {
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

function _pathManager() {
  const data = require("../util/pathManager");

  _pathManager = function () {
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

const defaultPlugs = ["desktop", "desktop-legacy", "home", "x11", "wayland", "unity7", "browser-support", "network", "gsettings", "pulseaudio", "opengl"];

class SnapTarget extends _core().Target {
  constructor(name, packager, helper, outDir) {
    super(name);
    this.packager = packager;
    this.helper = helper;
    this.outDir = outDir;
    this.options = Object.assign({}, this.packager.platformSpecificBuildOptions, this.packager.config[this.name]);
    this.isUseTemplateApp = false;
  }

  replaceDefault(inList, defaultList) {
    const result = (0, _builderUtil().replaceDefault)(inList, defaultList);

    if (result !== defaultList) {
      this.isUseTemplateApp = false;
    }

    return result;
  }

  async createDescriptor(arch) {
    if (!this.isElectronVersionGreaterOrEqualThen("4.0.0")) {
      if (!this.isElectronVersionGreaterOrEqualThen("2.0.0-beta.1")) {
        throw new (_builderUtil().InvalidConfigurationError)("Electron 2 and higher is required to build Snap");
      }

      _builderUtil().log.warn("Electron 4 and higher is highly recommended for Snap");
    }

    const appInfo = this.packager.appInfo;
    const snapName = this.packager.executableName.toLowerCase();
    const options = this.options;
    const plugs = normalizePlugConfiguration(this.options.plugs);
    const plugNames = this.replaceDefault(plugs == null ? null : Object.getOwnPropertyNames(plugs), defaultPlugs);
    const buildPackages = (0, _builderUtilRuntime().asArray)(options.buildPackages);
    const defaultStagePackages = getDefaultStagePackages();
    const stagePackages = this.replaceDefault(options.stagePackages, defaultStagePackages);
    this.isUseTemplateApp = this.options.useTemplateApp !== false && (arch === _builderUtil().Arch.x64 || arch === _builderUtil().Arch.armv7l) && buildPackages.length === 0 && isArrayEqualRegardlessOfSort(stagePackages, defaultStagePackages);
    const appDescriptor = {
      command: "command.sh",
      plugs: plugNames,
      adapter: "none"
    };
    const snap = (0, _jsYaml().safeLoad)((await (0, _fsExtra().readFile)(path.join((0, _pathManager().getTemplatePath)("snap"), "snapcraft.yaml"), "utf-8")));

    if (this.isUseTemplateApp) {
      delete appDescriptor.adapter;
    }

    if (options.grade != null) {
      snap.grade = options.grade;
    }

    if (options.confinement != null) {
      snap.confinement = options.confinement;
    }

    (0, _builderUtil().deepAssign)(snap, {
      name: snapName,
      version: appInfo.version,
      summary: options.summary || appInfo.productName,
      description: this.helper.getDescription(options),
      architectures: [(0, _builderUtil().toLinuxArchString)(arch, "snap")],
      apps: {
        [snapName]: appDescriptor
      },
      parts: {
        app: {
          "stage-packages": stagePackages
        }
      }
    });

    if (options.confinement === "classic") {
      delete appDescriptor.plugs;
      delete snap.plugs;
    } else {
      const archTriplet = archNameToTriplet(arch);
      appDescriptor.environment = Object.assign({
        // https://github.com/electron-userland/electron-builder/issues/4007
        // https://github.com/electron/electron/issues/9056
        DISABLE_WAYLAND: "1",
        TMPDIR: "$XDG_RUNTIME_DIR",
        PATH: "$SNAP/usr/sbin:$SNAP/usr/bin:$SNAP/sbin:$SNAP/bin:$PATH",
        SNAP_DESKTOP_RUNTIME: "$SNAP/gnome-platform",
        LD_LIBRARY_PATH: ["$SNAP_LIBRARY_PATH", "$SNAP/lib:$SNAP/usr/lib:$SNAP/lib/" + archTriplet + ":$SNAP/usr/lib/" + archTriplet, "$LD_LIBRARY_PATH:$SNAP/lib:$SNAP/usr/lib", "$SNAP/lib/" + archTriplet + ":$SNAP/usr/lib/" + archTriplet].join(":")
      }, options.environment);

      if (plugs != null) {
        for (const plugName of plugNames) {
          const plugOptions = plugs[plugName];

          if (plugOptions == null) {
            continue;
          }

          snap.plugs[plugName] = plugOptions;
        }
      }
    }

    if (buildPackages.length > 0) {
      snap.parts.app["build-packages"] = buildPackages;
    }

    if (options.after != null) {
      snap.parts.app.after = options.after;
    }

    if (options.assumes != null) {
      snap.assumes = (0, _builderUtilRuntime().asArray)(options.assumes);
    }

    return snap;
  }

  async build(appOutDir, arch) {
    const packager = this.packager;
    const options = this.options; // tslint:disable-next-line:no-invalid-template-strings

    const artifactName = packager.expandArtifactNamePattern(this.options, "snap", arch, "${name}_${version}_${arch}.${ext}", false);
    const artifactPath = path.join(this.outDir, artifactName);
    await packager.info.callArtifactBuildStarted({
      targetPresentableName: "snap",
      file: artifactPath,
      arch
    });
    const snap = await this.createDescriptor(arch);

    if (this.isUseTemplateApp) {
      delete snap.parts;
    }

    const stageDir = await (0, _targetUtil().createStageDirPath)(this, packager, arch);
    const snapArch = (0, _builderUtil().toLinuxArchString)(arch, "snap");
    const args = ["snap", "--app", appOutDir, "--stage", stageDir, "--arch", snapArch, "--output", artifactPath, "--executable", this.packager.executableName];
    await this.helper.icons;

    if (this.helper.maxIconPath != null) {
      if (!this.isUseTemplateApp) {
        snap.icon = "snap/gui/icon.png";
      }

      args.push("--icon", this.helper.maxIconPath);
    } // snapcraft.yaml inside a snap directory


    const snapMetaDir = path.join(stageDir, this.isUseTemplateApp ? "meta" : "snap");
    const desktopFile = path.join(snapMetaDir, "gui", `${snap.name}.desktop`);
    await this.helper.writeDesktopEntry(this.options, packager.executableName, desktopFile, {
      // tslint:disable:no-invalid-template-strings
      Icon: "${SNAP}/meta/gui/icon.png"
    });

    if (this.isElectronVersionGreaterOrEqualThen("5.0.0") && !isBrowserSandboxAllowed(snap)) {
      args.push("--extraAppArgs=--no-sandbox");

      if (this.isUseTemplateApp) {
        args.push("--exclude", "chrome-sandbox");
      }
    }

    if (packager.packagerOptions.effectiveOptionComputed != null && (await packager.packagerOptions.effectiveOptionComputed({
      snap,
      desktopFile,
      args
    }))) {
      return;
    }

    await (0, _fsExtra().outputFile)(path.join(snapMetaDir, this.isUseTemplateApp ? "snap.yaml" : "snapcraft.yaml"), (0, _builderUtil().serializeToYaml)(snap));
    const hooksDir = await packager.getResource(options.hooks, "snap-hooks");

    if (hooksDir != null) {
      args.push("--hooks", hooksDir);
    }

    if (this.isUseTemplateApp) {
      args.push("--template-url", `electron4:${snapArch}`);
    }

    await (0, _builderUtil().executeAppBuilder)(args);
    await packager.info.callArtifactBuildCompleted({
      file: artifactPath,
      safeArtifactName: packager.computeSafeArtifactName(artifactName, "snap", arch, false),
      target: this,
      arch,
      packager,
      publishConfig: options.publish == null ? {
        provider: "snapStore"
      } : null
    });
  }

  isElectronVersionGreaterOrEqualThen(version) {
    return semver().gte(this.packager.config.electronVersion || "5.0.3", version);
  }

}

exports.default = SnapTarget;

function archNameToTriplet(arch) {
  switch (arch) {
    case _builderUtil().Arch.x64:
      return "x86_64-linux-gnu";

    case _builderUtil().Arch.ia32:
      return "i386-linux-gnu";

    case _builderUtil().Arch.armv7l:
      // noinspection SpellCheckingInspection
      return "arm-linux-gnueabihf";

    case _builderUtil().Arch.arm64:
      return "aarch64-linux-gnu";

    default:
      throw new Error(`Unsupported arch ${arch}`);
  }
}

function isArrayEqualRegardlessOfSort(a, b) {
  a = a.slice();
  b = b.slice();
  a.sort();
  b.sort();
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

function normalizePlugConfiguration(raw) {
  if (raw == null) {
    return null;
  }

  const result = {};

  for (const item of Array.isArray(raw) ? raw : [raw]) {
    if (typeof item === "string") {
      result[item] = null;
    } else {
      Object.assign(result, item);
    }
  }

  return result;
}

function isBrowserSandboxAllowed(snap) {
  if (snap.plugs != null) {
    for (const plugName of Object.keys(snap.plugs)) {
      const plug = snap.plugs[plugName];

      if (plug.interface === "browser-support" && plug["allow-sandbox"] === true) {
        return true;
      }
    }
  }

  return false;
}

function getDefaultStagePackages() {
  // libxss1 - was "error while loading shared libraries: libXss.so.1" on Xubuntu 16.04
  // noinspection SpellCheckingInspection
  return ["libnspr4", "libnss3", "libxss1", "libappindicator3-1", "libsecret-1-0"];
} 
// __ts-babel@6.0.4
//# sourceMappingURL=snap.js.map