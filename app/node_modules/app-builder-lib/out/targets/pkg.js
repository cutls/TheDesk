"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.prepareProductBuildArgs = prepareProductBuildArgs;
exports.PkgTarget = void 0;

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

function _macCodeSign() {
  const data = require("../codeSign/macCodeSign");

  _macCodeSign = function () {
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

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const certType = "Developer ID Installer"; // http://www.shanekirk.com/2013/10/creating-flat-packages-in-osx/
// to use --scripts, we must build .app bundle separately using pkgbuild
// productbuild --scripts doesn't work (because scripts in this case not added to our package)
// https://github.com/electron-userland/electron-osx-sign/issues/96#issuecomment-274986942

class PkgTarget extends _core().Target {
  constructor(packager, outDir) {
    super("pkg");
    this.packager = packager;
    this.outDir = outDir;
    this.options = Object.assign({
      allowAnywhere: true,
      allowCurrentUserHome: true,
      allowRootDirectory: true
    }, this.packager.config.pkg);
  }

  async build(appPath, arch) {
    const packager = this.packager;
    const options = this.options;
    const appInfo = packager.appInfo; // pkg doesn't like not ASCII symbols (Could not open package to list files: /Volumes/test/t-gIjdGK/test-project-0/dist/Test App ßW-1.1.0.pkg)

    const artifactName = packager.expandArtifactNamePattern(options, "pkg");
    const artifactPath = path.join(this.outDir, artifactName);
    await packager.info.callArtifactBuildStarted({
      targetPresentableName: "pkg",
      file: artifactPath,
      arch
    });
    const keychainFile = (await packager.codeSigningInfo.value).keychainFile;
    const appOutDir = this.outDir; // https://developer.apple.com/library/content/documentation/DeveloperTools/Reference/DistributionDefinitionRef/Chapters/Distribution_XML_Ref.html

    const distInfoFile = path.join(appOutDir, "distribution.xml");
    const innerPackageFile = path.join(appOutDir, `${(0, _appInfo().filterCFBundleIdentifier)(appInfo.id)}.pkg`);
    const componentPropertyListFile = path.join(appOutDir, `${(0, _appInfo().filterCFBundleIdentifier)(appInfo.id)}.plist`);
    const identity = (await Promise.all([(0, _macCodeSign().findIdentity)(certType, options.identity || packager.platformSpecificBuildOptions.identity, keychainFile), this.customizeDistributionConfiguration(distInfoFile, appPath), this.buildComponentPackage(appPath, componentPropertyListFile, innerPackageFile)]))[0];

    if (identity == null && packager.forceCodeSigning) {
      throw new Error(`Cannot find valid "${certType}" to sign standalone installer, please see https://electron.build/code-signing`);
    }

    const args = prepareProductBuildArgs(identity, keychainFile);
    args.push("--distribution", distInfoFile);
    args.push(artifactPath);
    (0, _builderUtil().use)(options.productbuild, it => args.push(...it));
    await (0, _builderUtil().exec)("productbuild", args, {
      cwd: appOutDir
    });
    await Promise.all([(0, _fsExtra().unlink)(innerPackageFile), (0, _fsExtra().unlink)(distInfoFile)]);
    await packager.dispatchArtifactCreated(artifactPath, this, arch, packager.computeSafeArtifactName(artifactName, "pkg", arch));
  }

  async customizeDistributionConfiguration(distInfoFile, appPath) {
    await (0, _builderUtil().exec)("productbuild", ["--synthesize", "--component", appPath, distInfoFile], {
      cwd: this.outDir
    });
    const options = this.options;
    let distInfo = await (0, _fsExtra().readFile)(distInfoFile, "utf-8");
    const insertIndex = distInfo.lastIndexOf("</installer-gui-script>");
    distInfo = distInfo.substring(0, insertIndex) + `    <domains enable_anywhere="${options.allowAnywhere}" enable_currentUserHome="${options.allowCurrentUserHome}" enable_localSystem="${options.allowRootDirectory}" />\n` + distInfo.substring(insertIndex);

    if (options.background != null) {
      const background = await this.packager.getResource(options.background.file);

      if (background != null) {
        const alignment = options.background.alignment || "center"; // noinspection SpellCheckingInspection

        const scaling = options.background.scaling || "tofit";
        distInfo = distInfo.substring(0, insertIndex) + `    <background file="${background}" alignment="${alignment}" scaling="${scaling}"/>\n` + distInfo.substring(insertIndex);
      }
    }

    const welcome = await this.packager.getResource(options.welcome);

    if (welcome != null) {
      distInfo = distInfo.substring(0, insertIndex) + `    <welcome file="${welcome}"/>\n` + distInfo.substring(insertIndex);
    }

    const license = await (0, _license().getNotLocalizedLicenseFile)(options.license, this.packager);

    if (license != null) {
      distInfo = distInfo.substring(0, insertIndex) + `    <license file="${license}"/>\n` + distInfo.substring(insertIndex);
    }

    const conclusion = await this.packager.getResource(options.conclusion);

    if (conclusion != null) {
      distInfo = distInfo.substring(0, insertIndex) + `    <conclusion file="${conclusion}"/>\n` + distInfo.substring(insertIndex);
    }

    (0, _builderUtil().debug)(distInfo);
    await (0, _fsExtra().writeFile)(distInfoFile, distInfo);
  }

  async buildComponentPackage(appPath, propertyListOutputFile, packageOutputFile) {
    const options = this.options;
    const rootPath = path.dirname(appPath); // first produce a component plist template

    await (0, _builderUtil().exec)("pkgbuild", ["--analyze", "--root", rootPath, propertyListOutputFile]); // process the template plist

    const plistInfo = (await (0, _appBuilder().executeAppBuilderAsJson)(["decode-plist", "-f", propertyListOutputFile]))[0];

    if (plistInfo.length > 0) {
      const packageInfo = plistInfo[0]; // ChildBundles lists all of electron binaries within the .app.
      // There is no particular reason for removing that key, except to be as close as possible to
      // the PackageInfo generated by previous versions of electron-builder.

      delete packageInfo.ChildBundles;

      if (options.isRelocatable != null) {
        packageInfo.BundleIsRelocatable = options.isRelocatable;
      }

      if (options.isVersionChecked != null) {
        packageInfo.BundleIsVersionChecked = options.isVersionChecked;
      }

      if (options.hasStrictIdentifier != null) {
        packageInfo.BundleHasStrictIdentifier = options.hasStrictIdentifier;
      }

      if (options.overwriteAction != null) {
        packageInfo.BundleOverwriteAction = options.overwriteAction;
      }

      await (0, _appBuilder().executeAppBuilderAndWriteJson)(["encode-plist"], {
        [propertyListOutputFile]: plistInfo
      });
    } // now build the package


    const args = ["--root", rootPath, "--component-plist", propertyListOutputFile];
    (0, _builderUtil().use)(this.options.installLocation || "/Applications", it => args.push("--install-location", it));

    if (options.scripts != null) {
      args.push("--scripts", path.resolve(this.packager.info.buildResourcesDir, options.scripts));
    } else if (options.scripts !== null) {
      const dir = path.join(this.packager.info.buildResourcesDir, "pkg-scripts");
      const stat = await (0, _fs().statOrNull)(dir);

      if (stat != null && stat.isDirectory()) {
        args.push("--scripts", dir);
      }
    }

    args.push(packageOutputFile);
    await (0, _builderUtil().exec)("pkgbuild", args);
  }

}

exports.PkgTarget = PkgTarget;

function prepareProductBuildArgs(identity, keychain) {
  const args = [];

  if (identity != null) {
    args.push("--sign", identity.hash);

    if (keychain != null) {
      args.push("--keychain", keychain);
    }
  }

  return args;
} 
// __ts-babel@6.0.4
//# sourceMappingURL=pkg.js.map