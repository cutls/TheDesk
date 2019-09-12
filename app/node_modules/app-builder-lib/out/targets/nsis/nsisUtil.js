"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CopyElevateHelper = exports.AppPackageHelper = exports.NSIS_PATH = exports.nsisTemplatesDir = void 0;

function _bluebirdLst() {
  const data = _interopRequireDefault(require("bluebird-lst"));

  _bluebirdLst = function () {
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

function _binDownload() {
  const data = require("../../binDownload");

  _binDownload = function () {
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

function _lazyVal() {
  const data = require("lazy-val");

  _lazyVal = function () {
    return data;
  };

  return data;
}

var path = _interopRequireWildcard(require("path"));

function _pathManager() {
  const data = require("../../util/pathManager");

  _pathManager = function () {
    return data;
  };

  return data;
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const nsisTemplatesDir = (0, _pathManager().getTemplatePath)("nsis");
exports.nsisTemplatesDir = nsisTemplatesDir;
const NSIS_PATH = new (_lazyVal().Lazy)(() => {
  const custom = process.env.ELECTRON_BUILDER_NSIS_DIR;

  if (custom != null && custom.length > 0) {
    return Promise.resolve(custom.trim());
  } // noinspection SpellCheckingInspection


  return (0, _binDownload().getBinFromUrl)("nsis", "3.0.3.2", "tUrlDPQtbjcooNbTrjUzLupttWlATLDNWqK57TVr+gAt3wkaxFxBS3k80AzEFJbmSeOWrUooO72FFOVGXcoxhA==");
});
exports.NSIS_PATH = NSIS_PATH;

class AppPackageHelper {
  constructor(elevateHelper) {
    this.elevateHelper = elevateHelper;
    this.archToFileInfo = new Map();
    this.infoToIsDelete = new Map();
    /** @private */

    this.refCount = 0;
  }

  async packArch(arch, target) {
    let infoPromise = this.archToFileInfo.get(arch);

    if (infoPromise == null) {
      const appOutDir = target.archs.get(arch);
      infoPromise = this.elevateHelper.copy(appOutDir, target).then(() => target.buildAppPackage(appOutDir, arch));
      this.archToFileInfo.set(arch, infoPromise);
    }

    const info = await infoPromise;

    if (target.isWebInstaller) {
      this.infoToIsDelete.set(info, false);
    } else if (!this.infoToIsDelete.has(info)) {
      this.infoToIsDelete.set(info, true);
    }

    return info;
  }

  async finishBuild() {
    if (--this.refCount > 0) {
      return;
    }

    const filesToDelete = [];

    for (const [info, isDelete] of this.infoToIsDelete.entries()) {
      if (isDelete) {
        filesToDelete.push(info.path);
      }
    }

    await _bluebirdLst().default.map(filesToDelete, it => (0, _fsExtra().unlink)(it));
  }

}

exports.AppPackageHelper = AppPackageHelper;

class CopyElevateHelper {
  constructor() {
    this.copied = new Map();
  }

  copy(appOutDir, target) {
    if (!target.packager.info.framework.isCopyElevateHelper) {
      return Promise.resolve();
    }

    let isPackElevateHelper = target.options.packElevateHelper;

    if (isPackElevateHelper === false && target.options.perMachine === true) {
      isPackElevateHelper = true;

      _builderUtil().log.warn("`packElevateHelper = false` is ignored, because `perMachine` is set to `true`");
    }

    if (isPackElevateHelper === false) {
      return Promise.resolve();
    }

    let promise = this.copied.get(appOutDir);

    if (promise != null) {
      return promise;
    }

    promise = NSIS_PATH.value.then(it => {
      const outFile = path.join(appOutDir, "resources", "elevate.exe");
      const promise = (0, _fs().copyFile)(path.join(it, "elevate.exe"), outFile, false);

      if (target.packager.platformSpecificBuildOptions.signAndEditExecutable !== false) {
        return promise.then(() => target.packager.sign(outFile));
      }

      return promise;
    });
    this.copied.set(appOutDir, promise);
    return promise;
  }

} exports.CopyElevateHelper = CopyElevateHelper;
// __ts-babel@6.0.4
//# sourceMappingURL=nsisUtil.js.map