"use strict";

function _fsExtra() {
  const data = require("fs-extra");

  _fsExtra = function () {
    return data;
  };

  return data;
}

var path = _interopRequireWildcard(require("path"));

function _() {
  const data = require("..");

  _ = function () {
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

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

if (process.env.BUILDER_REMOVE_STAGE_EVEN_IF_DEBUG == null) {
  process.env.BUILDER_REMOVE_STAGE_EVEN_IF_DEBUG = "true";
}

async function doBuild(data) {
  if (process.env.APP_BUILDER_TMP_DIR == null) {
    throw new (_builderUtil().InvalidConfigurationError)("Env APP_BUILDER_TMP_DIR must be set for builder process");
  }

  const projectDir = process.env.PROJECT_DIR;

  if (projectDir == null) {
    throw new (_builderUtil().InvalidConfigurationError)("Env PROJECT_DIR must be set for builder process");
  }

  const targets = data.targets;

  if (data.platform == null) {
    throw new (_builderUtil().InvalidConfigurationError)("platform not specified");
  }

  if (targets == null) {
    throw new (_builderUtil().InvalidConfigurationError)("targets path not specified");
  }

  if (!Array.isArray(targets)) {
    throw new (_builderUtil().InvalidConfigurationError)("targets must be array of target name");
  }

  const infoFile = projectDir + path.sep + "info.json";
  const info = await (0, _fsExtra().readJson)(infoFile);
  const projectOutDir = process.env.PROJECT_OUT_DIR;

  if (projectDir == null) {
    throw new (_builderUtil().InvalidConfigurationError)("Env PROJECT_OUT_DIR must be set for builder process");
  } // yes, for now we expect the only target


  const prepackaged = projectDir + path.sep + targets[0].unpackedDirName; // do not use build function because we don't need to publish artifacts

  const options = {
    prepackaged,
    projectDir,
    [data.platform]: targets.map(it => it.name + ":" + it.arch),
    publish: "never"
  };
  const packager = new (_().Packager)(options);
  const artifacts = [];
  const relativePathOffset = projectOutDir.length + 1;
  packager.artifactCreated(event => {
    if (event.file == null) {
      return;
    }

    artifacts.push({
      file: event.file.substring(relativePathOffset),
      target: event.target == null ? null : event.target.name,
      arch: event.arch,
      safeArtifactName: event.safeArtifactName,
      isWriteUpdateInfo: event.isWriteUpdateInfo === true,
      updateInfo: event.updateInfo
    });
  });

  packager.stageDirPathCustomizer = (target, packager, arch) => {
    // snap creates a lot of files and so, we cannot use tmpfs to avoid out of memory error
    const parentDir = target.name === "snap" && !target.isUseTemplateApp ? projectOutDir : projectDir;
    return parentDir + path.sep + `__${target.name}-${_().Arch[arch]}`;
  }; // _build method expects final effective configuration - packager.options.config is ignored


  await packager._build(Object.assign({}, info.configuration, {
    publish: null,
    beforeBuild: null,
    afterPack: null,
    afterSign: null,
    afterAllArtifactBuild: null,
    onNodeModuleFile: null,
    directories: {
      output: projectOutDir,
      buildResources: projectDir + path.sep + info.buildResourceDirName
    }
  }), info.metadata, info.devMetadata, info.repositoryInfo); // writeJson must be not used because it adds unwanted \n as last file symbol

  await (0, _fsExtra().writeFile)(path.join(process.env.APP_BUILDER_TMP_DIR, "__build-result.json"), JSON.stringify(artifacts));
}

doBuild(JSON.parse(process.argv[2])).catch(error => {
  process.exitCode = 0;
  return (0, _fsExtra().writeFile)(path.join(process.env.APP_BUILDER_TMP_DIR, "__build-result.json"), (error.stack || error).toString());
}); 
// __ts-babel@6.0.4
//# sourceMappingURL=builder-cli.js.map