"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createUpdateInfoTasks = createUpdateInfoTasks;
exports.writeUpdateInfoFiles = writeUpdateInfoFiles;

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

function _hash() {
  const data = require("../util/hash");

  _hash = function () {
    return data;
  };

  return data;
}

function _PublishManager() {
  const data = require("./PublishManager");

  _PublishManager = function () {
    return data;
  };

  return data;
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function getReleaseInfo(packager) {
  const releaseInfo = Object.assign({}, packager.platformSpecificBuildOptions.releaseInfo || packager.config.releaseInfo);

  if (releaseInfo.releaseNotes == null) {
    const releaseNotesFile = await packager.getResource(releaseInfo.releaseNotesFile, `release-notes-${packager.platform.buildConfigurationKey}.md`, `release-notes-${packager.platform.name}.md`, `release-notes-${packager.platform.nodeName}.md`, "release-notes.md");
    const releaseNotes = releaseNotesFile == null ? null : await (0, _fsExtra().readFile)(releaseNotesFile, "utf-8"); // to avoid undefined in the file, check for null

    if (releaseNotes != null) {
      releaseInfo.releaseNotes = releaseNotes;
    }
  }

  delete releaseInfo.releaseNotesFile;
  return releaseInfo;
}

function isGenerateUpdatesFilesForAllChannels(packager) {
  const value = packager.platformSpecificBuildOptions.generateUpdatesFilesForAllChannels;
  return value == null ? packager.config.generateUpdatesFilesForAllChannels : value;
}
/**
 if this is an "alpha" version, we need to generate only the "alpha" .yml file
 if this is a "beta" version, we need to generate both the "alpha" and "beta" .yml file
 if this is a "stable" version, we need to generate all the "alpha", "beta" and "stable" .yml file
 */


function computeChannelNames(packager, publishConfig) {
  const currentChannel = publishConfig.channel || "latest"; // for GitHub should be pre-release way be used

  if (currentChannel === "alpha" || publishConfig.provider === "github" || !isGenerateUpdatesFilesForAllChannels(packager)) {
    return [currentChannel];
  }

  switch (currentChannel) {
    case "beta":
      return [currentChannel, "alpha"];

    case "latest":
      return [currentChannel, "alpha", "beta"];

    default:
      return [currentChannel];
  }
}

function getUpdateInfoFileName(channel, packager, arch) {
  const osSuffix = packager.platform === _core().Platform.WINDOWS ? "" : `-${packager.platform.buildConfigurationKey}`;
  return `${channel}${osSuffix}${getArchPrefixForUpdateFile(arch, packager)}.yml`;
}

function getArchPrefixForUpdateFile(arch, packager) {
  if (arch == null || arch === _builderUtil().Arch.x64 || packager.platform !== _core().Platform.LINUX) {
    return "";
  }

  return arch === _builderUtil().Arch.armv7l ? "-arm" : `-${_builderUtil().Arch[arch]}`;
}

function computeIsisElectronUpdater1xCompatibility(updaterCompatibility, publishConfiguration, packager) {
  if (updaterCompatibility != null) {
    return semver().satisfies("1.0.0", updaterCompatibility);
  } // spaces is a new publish provider, no need to keep backward compatibility


  if (publishConfiguration.provider === "spaces") {
    return false;
  }

  const updaterVersion = packager.metadata.dependencies == null ? null : packager.metadata.dependencies["electron-updater"];
  return updaterVersion == null || semver().lt(updaterVersion, "4.0.0");
}
/** @internal */


async function createUpdateInfoTasks(event, _publishConfigs) {
  const packager = event.packager;
  const publishConfigs = await (0, _PublishManager().getPublishConfigsForUpdateInfo)(packager, _publishConfigs, event.arch);

  if (publishConfigs == null || publishConfigs.length === 0) {
    return [];
  }

  const outDir = event.target.outDir;
  const version = packager.appInfo.version;
  const sha2 = new (_lazyVal().Lazy)(() => (0, _hash().hashFile)(event.file, "sha256", "hex"));

  const isMac = packager.platform === _core().Platform.MAC;

  const createdFiles = new Set();
  const sharedInfo = await createUpdateInfo(version, event, (await getReleaseInfo(packager)));
  const tasks = [];
  const electronUpdaterCompatibility = packager.platformSpecificBuildOptions.electronUpdaterCompatibility || packager.config.electronUpdaterCompatibility || ">=2.15";

  for (const publishConfiguration of publishConfigs) {
    const isBintray = publishConfiguration.provider === "bintray";
    let dir = outDir; // Bintray uses different variant of channel file info, better to generate it to a separate dir by always

    if (isBintray || publishConfigs.length > 1 && publishConfiguration !== publishConfigs[0]) {
      dir = path.join(outDir, publishConfiguration.provider);
    }

    let isElectronUpdater1xCompatibility = computeIsisElectronUpdater1xCompatibility(electronUpdaterCompatibility, publishConfiguration, packager.info);
    let info = sharedInfo; // noinspection JSDeprecatedSymbols

    if (isElectronUpdater1xCompatibility && packager.platform === _core().Platform.WINDOWS) {
      info = Object.assign({}, info); // noinspection JSDeprecatedSymbols

      info.sha2 = await sha2.value;
    }

    if (event.safeArtifactName != null && publishConfiguration.provider === "github") {
      const newFiles = info.files.slice();
      newFiles[0].url = event.safeArtifactName;
      info = Object.assign({}, info, {
        files: newFiles,
        path: event.safeArtifactName
      });
    }

    for (const channel of computeChannelNames(packager, publishConfiguration)) {
      if (isMac && isElectronUpdater1xCompatibility && event.file.endsWith(".zip")) {
        // write only for first channel (generateUpdatesFilesForAllChannels is a new functionality, no need to generate old mac update info file)
        isElectronUpdater1xCompatibility = false;
        await writeOldMacInfo(publishConfiguration, outDir, dir, channel, createdFiles, version, packager);
      }

      const updateInfoFile = path.join(dir, (isBintray ? `${version}_` : "") + getUpdateInfoFileName(channel, packager, event.arch));

      if (createdFiles.has(updateInfoFile)) {
        continue;
      }

      createdFiles.add(updateInfoFile); // artifact should be uploaded only to designated publish provider

      tasks.push({
        file: updateInfoFile,
        info,
        publishConfiguration,
        packager
      });
    }
  }

  return tasks;
}

async function createUpdateInfo(version, event, releaseInfo) {
  const customUpdateInfo = event.updateInfo;
  const url = path.basename(event.file);
  const sha512 = (customUpdateInfo == null ? null : customUpdateInfo.sha512) || (await (0, _hash().hashFile)(event.file));
  const files = [{
    url,
    sha512
  }];
  const result = Object.assign({
    version,
    files,
    path: url
    /* backward compatibility, electron-updater 1.x - electron-updater 2.15.0 */
    ,
    sha512
    /* backward compatibility, electron-updater 1.x - electron-updater 2.15.0 */

  }, releaseInfo);

  if (customUpdateInfo != null) {
    // file info or nsis web installer packages info
    Object.assign("sha512" in customUpdateInfo ? files[0] : result, customUpdateInfo);
  }

  return result;
}

async function writeUpdateInfoFiles(updateInfoFileTasks, packager) {
  // zip must be first and zip info must be used for old path/sha512 properties in the update info
  updateInfoFileTasks.sort((a, b) => (a.info.files[0].url.endsWith(".zip") ? 0 : 100) - (b.info.files[0].url.endsWith(".zip") ? 0 : 100));
  const updateChannelFileToInfo = new Map();

  for (const task of updateInfoFileTasks) {
    // https://github.com/electron-userland/electron-builder/pull/2994
    const key = `${task.file}@${(0, _builderUtil().safeStringifyJson)(task.publishConfiguration, new Set(["releaseType"]))}`;
    const existingTask = updateChannelFileToInfo.get(key);

    if (existingTask == null) {
      updateChannelFileToInfo.set(key, task);
      continue;
    }

    existingTask.info.files.push(...task.info.files);
  }

  const releaseDate = new Date().toISOString();
  await _bluebirdLst().default.map(updateChannelFileToInfo.values(), async task => {
    const publishConfig = task.publishConfiguration;

    if (publishConfig.publishAutoUpdate === false) {
      _builderUtil().log.debug({
        provider: publishConfig.provider,
        reason: "publishAutoUpdate is set to false"
      }, "auto update metadata file not published");

      return;
    }

    if (task.info.releaseDate == null) {
      task.info.releaseDate = releaseDate;
    }

    const fileContent = Buffer.from((0, _builderUtil().serializeToYaml)(task.info, false, true));
    await (0, _fsExtra().outputFile)(task.file, fileContent);
    packager.dispatchArtifactCreated({
      file: task.file,
      fileContent,
      arch: null,
      packager: task.packager,
      target: null,
      publishConfig
    });
  }, {
    concurrency: 4
  });
} // backward compatibility - write json file


async function writeOldMacInfo(publishConfig, outDir, dir, channel, createdFiles, version, packager) {
  const isGitHub = publishConfig.provider === "github";
  const updateInfoFile = isGitHub && outDir === dir ? path.join(dir, "github", `${channel}-mac.json`) : path.join(dir, `${channel}-mac.json`);

  if (!createdFiles.has(updateInfoFile)) {
    createdFiles.add(updateInfoFile);
    await (0, _fsExtra().outputJson)(updateInfoFile, {
      version,
      releaseDate: new Date().toISOString(),
      url: (0, _PublishManager().computeDownloadUrl)(publishConfig, packager.generateName2("zip", "mac", isGitHub), packager)
    }, {
      spaces: 2
    });
    packager.info.dispatchArtifactCreated({
      file: updateInfoFile,
      arch: null,
      packager,
      target: null,
      publishConfig
    });
  }
} 
// __ts-babel@6.0.4
//# sourceMappingURL=updateInfoBuilder.js.map