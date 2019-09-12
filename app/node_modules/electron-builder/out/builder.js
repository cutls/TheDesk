"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createYargs = createYargs;
exports.normalizeOptions = normalizeOptions;
exports.coerceTypes = coerceTypes;
exports.createTargets = createTargets;
exports.build = build;
exports.configureBuildCommand = configureBuildCommand;

function _builderUtil() {
  const data = require("builder-util");

  _builderUtil = function () {
    return data;
  };

  return data;
}

function _chalk() {
  const data = _interopRequireDefault(require("chalk"));

  _chalk = function () {
    return data;
  };

  return data;
}

function _appBuilderLib() {
  const data = require("app-builder-lib");

  _appBuilderLib = function () {
    return data;
  };

  return data;
}

function _yargs() {
  const data = _interopRequireDefault(require("yargs"));

  _yargs = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createYargs() {
  return _yargs().default.parserConfiguration({
    "camel-case-expansion": false
  });
}
/** @private */


function normalizeOptions(args) {
  if (args.targets != null) {
    return args;
  }

  const targets = new Map();

  function processTargets(platform, types) {
    function commonArch(currentIfNotSpecified) {
      if (platform === _appBuilderLib().Platform.MAC) {
        return args.x64 || currentIfNotSpecified ? [_builderUtil().Arch.x64] : [];
      }

      const result = Array();

      if (args.x64) {
        result.push(_builderUtil().Arch.x64);
      }

      if (args.armv7l) {
        result.push(_builderUtil().Arch.armv7l);
      }

      if (args.arm64) {
        result.push(_builderUtil().Arch.arm64);
      }

      if (args.ia32) {
        result.push(_builderUtil().Arch.ia32);
      }

      return result.length === 0 && currentIfNotSpecified ? [(0, _builderUtil().archFromString)(process.arch)] : result;
    }

    let archToType = targets.get(platform);

    if (archToType == null) {
      archToType = new Map();
      targets.set(platform, archToType);
    }

    if (types.length === 0) {
      const defaultTargetValue = args.dir ? [_appBuilderLib().DIR_TARGET] : [];

      for (const arch of commonArch(args.dir === true)) {
        archToType.set(arch, defaultTargetValue);
      }

      return;
    }

    for (const type of types) {
      const suffixPos = type.lastIndexOf(":");

      if (suffixPos > 0) {
        (0, _builderUtil().addValue)(archToType, (0, _builderUtil().archFromString)(type.substring(suffixPos + 1)), type.substring(0, suffixPos));
      } else {
        for (const arch of commonArch(true)) {
          (0, _builderUtil().addValue)(archToType, arch, type);
        }
      }
    }
  }

  if (args.mac != null) {
    processTargets(_appBuilderLib().Platform.MAC, args.mac);
  }

  if (args.linux != null) {
    processTargets(_appBuilderLib().Platform.LINUX, args.linux);
  }

  if (args.win != null) {
    processTargets(_appBuilderLib().Platform.WINDOWS, args.win);
  }

  if (targets.size === 0) {
    processTargets(_appBuilderLib().Platform.current(), []);
  }

  const result = Object.assign({}, args);
  result.targets = targets;
  delete result.dir;
  delete result.mac;
  delete result.linux;
  delete result.win;
  const r = result;
  delete r.m;
  delete r.o;
  delete r.l;
  delete r.w;
  delete r.windows;
  delete r.macos;
  delete r.$0;
  delete r._;
  delete r.version;
  delete r.help;
  delete r.c;
  delete r.p;
  delete r.pd;
  delete result.ia32;
  delete result.x64;
  delete result.armv7l;
  delete result.arm64;
  let config = result.config; // config is array when combining dot-notation values with a config file value
  // https://github.com/electron-userland/electron-builder/issues/2016

  if (Array.isArray(config)) {
    const newConfig = {};

    for (const configItem of config) {
      if (typeof configItem === "object") {
        (0, _builderUtil().deepAssign)(newConfig, configItem);
      } else if (typeof configItem === "string") {
        newConfig.extends = configItem;
      }
    }

    config = newConfig;
    result.config = newConfig;
  } // AJV cannot coerce "null" string to null if string is also allowed (because null string is a valid value)


  if (config != null && typeof config !== "string") {
    if (config.extraMetadata != null) {
      coerceTypes(config.extraMetadata);
    } // ability to disable code sign using -c.mac.identity=null


    if (config.mac != null) {
      coerceValue(config.mac, "identity");
    }
  }

  if ("project" in r && !("projectDir" in result)) {
    result.projectDir = r.project;
  }

  delete r.project;
  return result;
}

function coerceValue(host, key) {
  const value = host[key];

  if (value === "true") {
    host[key] = true;
  } else if (value === "false") {
    host[key] = false;
  } else if (value === "null") {
    host[key] = null;
  } else if (key === "version" && typeof value === "number") {
    host[key] = value.toString();
  } else if (value != null && typeof value === "object") {
    coerceTypes(value);
  }
}
/** @private */


function coerceTypes(host) {
  for (const key of Object.getOwnPropertyNames(host)) {
    coerceValue(host, key);
  }

  return host;
}

function createTargets(platforms, type, arch) {
  const targets = new Map();

  for (const platform of platforms) {
    const archs = platform === _appBuilderLib().Platform.MAC ? [_builderUtil().Arch.x64] : arch === "all" ? [_builderUtil().Arch.x64, _builderUtil().Arch.ia32] : [(0, _builderUtil().archFromString)(arch == null ? process.arch : arch)];
    const archToType = new Map();
    targets.set(platform, archToType);

    for (const arch of archs) {
      archToType.set(arch, type == null ? [] : [type]);
    }
  }

  return targets;
}

function build(rawOptions) {
  const buildOptions = normalizeOptions(rawOptions || {});
  return (0, _appBuilderLib().build)(buildOptions, new (_appBuilderLib().Packager)(buildOptions));
}
/**
 * @private
 */


function configureBuildCommand(yargs) {
  const publishGroup = "Publishing:";
  const buildGroup = "Building:";
  return yargs.option("mac", {
    group: buildGroup,
    alias: ["m", "o", "macos"],
    description: `Build for macOS, accepts target list (see ${_chalk().default.underline("https://goo.gl/5uHuzj")}).`,
    type: "array"
  }).option("linux", {
    group: buildGroup,
    alias: "l",
    description: `Build for Linux, accepts target list (see ${_chalk().default.underline("https://goo.gl/4vwQad")})`,
    type: "array"
  }).option("win", {
    group: buildGroup,
    alias: ["w", "windows"],
    description: `Build for Windows, accepts target list (see ${_chalk().default.underline("https://goo.gl/jYsTEJ")})`,
    type: "array"
  }).option("x64", {
    group: buildGroup,
    description: "Build for x64",
    type: "boolean"
  }).option("ia32", {
    group: buildGroup,
    description: "Build for ia32",
    type: "boolean"
  }).option("armv7l", {
    group: buildGroup,
    description: "Build for armv7l",
    type: "boolean"
  }).option("arm64", {
    group: buildGroup,
    description: "Build for arm64",
    type: "boolean"
  }).option("dir", {
    group: buildGroup,
    description: "Build unpacked dir. Useful to test.",
    type: "boolean"
  }).option("publish", {
    group: publishGroup,
    alias: "p",
    description: `Publish artifacts, see ${_chalk().default.underline("https://goo.gl/tSFycD")}`,
    choices: ["onTag", "onTagOrDraft", "always", "never", undefined]
  }).option("prepackaged", {
    alias: ["pd"],
    group: buildGroup,
    description: "The path to prepackaged app (to pack in a distributable format)"
  }).option("projectDir", {
    alias: ["project"],
    group: buildGroup,
    description: "The path to project directory. Defaults to current working directory."
  }).option("config", {
    alias: ["c"],
    group: buildGroup,
    description: "The path to an electron-builder config. Defaults to `electron-builder.yml` (or `json`, or `json5`), see " + _chalk().default.underline("https://goo.gl/YFRJOM")
  }).group(["help", "version"], "Other:").example("electron-builder -mwl", "build for macOS, Windows and Linux").example("electron-builder --linux deb tar.xz", "build deb and tar.xz for Linux").example("electron-builder --win --ia32", "build for Windows ia32").example("electron-builder -c.extraMetadata.foo=bar", "set package.json property `foo` to `bar`").example("electron-builder --config.nsis.unicode=false", "configure unicode options for NSIS");
} 
// __ts-babel@6.0.4
//# sourceMappingURL=builder.js.map