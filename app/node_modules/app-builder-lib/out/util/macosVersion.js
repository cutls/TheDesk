"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isMacOsHighSierra = isMacOsHighSierra;
exports.isMacOsSierra = isMacOsSierra;
exports.isMacOsCatalina = isMacOsCatalina;

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

function semver() {
  const data = _interopRequireWildcard(require("semver"));

  semver = function () {
    return data;
  };

  return data;
}

function _log() {
  const data = require("builder-util/out/log");

  _log = function () {
    return data;
  };

  return data;
}

function _os() {
  const data = require("os");

  _os = function () {
    return data;
  };

  return data;
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const macOsVersion = new (_lazyVal().Lazy)(async () => {
  const file = await (0, _fsExtra().readFile)("/System/Library/CoreServices/SystemVersion.plist", "utf8");
  const matches = /<key>ProductVersion<\/key>[\s\S]*<string>([\d.]+)<\/string>/.exec(file);

  if (!matches) {
    throw new Error("Couldn't find the macOS version");
  }

  _log().log.debug({
    version: matches[1]
  }, "macOS version");

  return clean(matches[1]);
});

function clean(version) {
  return version.split(".").length === 2 ? `${version}.0` : version;
}

async function isOsVersionGreaterThanOrEqualTo(input) {
  return semver().gte((await macOsVersion.value), clean(input));
}

function isMacOsHighSierra() {
  // 17.7.0 === 10.13.6
  return process.platform === "darwin" && semver().gte((0, _os().release)(), "17.7.0");
}

async function isMacOsSierra() {
  return process.platform === "darwin" && (await isOsVersionGreaterThanOrEqualTo("10.12.0"));
}

function isMacOsCatalina() {
  return process.platform === "darwin" && semver().gte((0, _os().release)(), "19.0.0");
} 
// __ts-babel@6.0.4
//# sourceMappingURL=macosVersion.js.map