"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.installOrRebuild = installOrRebuild;
exports.getGypEnv = getGypEnv;
exports.rebuild = rebuild;

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

function _os() {
  const data = require("os");

  _os = function () {
    return data;
  };

  return data;
}

var path = _interopRequireWildcard(require("path"));

function _appBuilder() {
  const data = require("./appBuilder");

  _appBuilder = function () {
    return data;
  };

  return data;
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

async function installOrRebuild(config, appDir, options, forceInstall = false) {
  const effectiveOptions = Object.assign({
    buildFromSource: config.buildDependenciesFromSource === true,
    additionalArgs: (0, _builderUtil().asArray)(config.npmArgs)
  }, options);

  if (forceInstall || !(await (0, _fsExtra().pathExists)(path.join(appDir, "node_modules")))) {
    await installDependencies(appDir, effectiveOptions);
  } else {
    await rebuild(appDir, effectiveOptions);
  }
}

function getElectronGypCacheDir() {
  return path.join((0, _os().homedir)(), ".electron-gyp");
}

function getGypEnv(frameworkInfo, platform, arch, buildFromSource) {
  const npmConfigArch = arch === "armv7l" ? "arm" : arch;
  const common = Object.assign({}, process.env, {
    npm_config_arch: npmConfigArch,
    npm_config_target_arch: npmConfigArch,
    npm_config_platform: platform,
    npm_config_build_from_source: buildFromSource,
    // required for node-pre-gyp
    npm_config_target_platform: platform,
    npm_config_update_binary: true,
    npm_config_fallback_to_build: true
  });

  if (platform !== process.platform) {
    common.npm_config_force = "true";
  }

  if (platform === "win32") {
    common.npm_config_target_libc = "unknown";
  }

  if (!frameworkInfo.useCustomDist) {
    return common;
  } // https://github.com/nodejs/node-gyp/issues/21


  return Object.assign({}, common, {
    npm_config_disturl: "https://electronjs.org/headers",
    npm_config_target: frameworkInfo.version,
    npm_config_runtime: "electron",
    npm_config_devdir: getElectronGypCacheDir()
  });
}

function installDependencies(appDir, options) {
  const platform = options.platform || process.platform;
  const arch = options.arch || process.arch;
  const additionalArgs = options.additionalArgs;

  _builderUtil().log.info({
    platform,
    arch,
    appDir
  }, `installing production dependencies`);

  let execPath = process.env.npm_execpath || process.env.NPM_CLI_JS;
  const execArgs = ["install", "--production"];

  if (!isRunningYarn(execPath)) {
    if (process.env.NPM_NO_BIN_LINKS === "true") {
      execArgs.push("--no-bin-links");
    }

    execArgs.push("--cache-min", "999999999");
  }

  if (execPath == null) {
    execPath = getPackageToolPath();
  } else {
    execArgs.unshift(execPath);
    execPath = process.env.npm_node_execpath || process.env.NODE_EXE || "node";
  }

  if (additionalArgs != null) {
    execArgs.push(...additionalArgs);
  }

  return (0, _builderUtil().spawn)(execPath, execArgs, {
    cwd: appDir,
    env: getGypEnv(options.frameworkInfo, platform, arch, options.buildFromSource === true)
  });
}

function getPackageToolPath() {
  if (process.env.FORCE_YARN === "true") {
    return process.platform === "win32" ? "yarn.cmd" : "yarn";
  } else {
    return process.platform === "win32" ? "npm.cmd" : "npm";
  }
}

function isRunningYarn(execPath) {
  const userAgent = process.env.npm_config_user_agent;
  return process.env.FORCE_YARN === "true" || execPath != null && path.basename(execPath).startsWith("yarn") || userAgent != null && /\byarn\b/.test(userAgent);
}
/** @internal */


async function rebuild(appDir, options) {
  const configuration = {
    dependencies: await options.productionDeps.value,
    nodeExecPath: process.execPath,
    platform: options.platform || process.platform,
    arch: options.arch || process.arch,
    additionalArgs: options.additionalArgs,
    execPath: process.env.npm_execpath || process.env.NPM_CLI_JS,
    buildFromSource: options.buildFromSource === true
  };
  const env = getGypEnv(options.frameworkInfo, configuration.platform, configuration.arch, options.buildFromSource === true);
  await (0, _appBuilder().executeAppBuilderAndWriteJson)(["rebuild-node-modules"], configuration, {
    env,
    cwd: appDir
  });
} 
// __ts-babel@6.0.4
//# sourceMappingURL=yarn.js.map