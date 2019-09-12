"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toLinuxArchString = toLinuxArchString;
exports.getArchCliNames = getArchCliNames;
exports.getArchSuffix = getArchSuffix;
exports.archFromString = archFromString;
exports.getArtifactArchName = getArtifactArchName;
exports.Arch = void 0;
var Arch;
exports.Arch = Arch;

(function (Arch) {
  Arch[Arch["ia32"] = 0] = "ia32";
  Arch[Arch["x64"] = 1] = "x64";
  Arch[Arch["armv7l"] = 2] = "armv7l";
  Arch[Arch["arm64"] = 3] = "arm64";
})(Arch || (exports.Arch = Arch = {}));

function toLinuxArchString(arch, targetName) {
  switch (arch) {
    case Arch.x64:
      return "amd64";

    case Arch.ia32:
      return targetName === "pacman" ? "i686" : "i386";

    case Arch.armv7l:
      return targetName === "snap" || targetName === "deb" ? "armhf" : "armv7l";

    case Arch.arm64:
      return "arm64";

    default:
      throw new Error(`Unsupported arch ${arch}`);
  }
}

function getArchCliNames() {
  return [Arch[Arch.ia32], Arch[Arch.x64], Arch[Arch.armv7l], Arch[Arch.arm64]];
}

function getArchSuffix(arch) {
  return arch === Arch.x64 ? "" : `-${Arch[arch]}`;
}

function archFromString(name) {
  switch (name) {
    case "x64":
      return Arch.x64;

    case "ia32":
      return Arch.ia32;

    case "arm64":
      return Arch.arm64;

    case "armv7l":
      return Arch.armv7l;

    default:
      throw new Error(`Unsupported arch ${name}`);
  }
}

function getArtifactArchName(arch, ext) {
  let archName = Arch[arch];
  const isAppImage = ext === "AppImage" || ext === "appimage";

  if (arch === Arch.x64) {
    if (isAppImage || ext === "rpm") {
      archName = "x86_64";
    } else if (ext === "deb" || ext === "snap") {
      archName = "amd64";
    }
  } else if (arch === Arch.ia32) {
    if (ext === "deb" || isAppImage || ext === "snap") {
      archName = "i386";
    } else if (ext === "pacman" || ext === "rpm") {
      archName = "i686";
    }
  } else if (arch === Arch.armv7l) {
    if (ext === "snap") {
      archName = "armhf";
    }
  }

  return archName;
} 
// __ts-babel@6.0.4
//# sourceMappingURL=arch.js.map