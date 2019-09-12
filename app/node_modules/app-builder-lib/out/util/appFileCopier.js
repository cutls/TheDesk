"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDestinationPath = getDestinationPath;
exports.copyAppFiles = copyAppFiles;
exports.transformFiles = transformFiles;
exports.computeFileSets = computeFileSets;
exports.computeNodeModuleFileSets = computeNodeModuleFileSets;
exports.ELECTRON_COMPILE_SHIM_FILENAME = void 0;

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

var path = _interopRequireWildcard(require("path"));

function _unpackDetector() {
  const data = require("../asar/unpackDetector");

  _unpackDetector = function () {
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

function _fileMatcher() {
  const data = require("../fileMatcher");

  _fileMatcher = function () {
    return data;
  };

  return data;
}

function _fileTransformer() {
  const data = require("../fileTransformer");

  _fileTransformer = function () {
    return data;
  };

  return data;
}

function _AppFileWalker() {
  const data = require("./AppFileWalker");

  _AppFileWalker = function () {
    return data;
  };

  return data;
}

function _NodeModuleCopyHelper() {
  const data = require("./NodeModuleCopyHelper");

  _NodeModuleCopyHelper = function () {
    return data;
  };

  return data;
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const BOWER_COMPONENTS_PATTERN = `${path.sep}bower_components${path.sep}`;
/** @internal */

const ELECTRON_COMPILE_SHIM_FILENAME = "__shim.js";
exports.ELECTRON_COMPILE_SHIM_FILENAME = ELECTRON_COMPILE_SHIM_FILENAME;

function getDestinationPath(file, fileSet) {
  if (file === fileSet.src) {
    return fileSet.destination;
  } else {
    const src = fileSet.src;
    const dest = fileSet.destination;

    if (file.length > src.length && file.startsWith(src) && file[src.length] === path.sep) {
      return dest + file.substring(src.length);
    } else {
      // hoisted node_modules
      // not lastIndexOf, to ensure that nested module (top-level module depends on) copied to parent node_modules, not to top-level directory
      // project https://github.com/angexis/punchcontrol/commit/cf929aba55c40d0d8901c54df7945e1d001ce022
      const index = file.indexOf(_fileTransformer().NODE_MODULES_PATTERN);

      if (index < 0) {
        throw new Error(`File "${file}" not under the source directory "${fileSet.src}"`);
      }

      return dest + file.substring(index + 1
      /* leading slash */
      );
    }
  }
}

async function copyAppFiles(fileSet, packager, transformer) {
  const metadata = fileSet.metadata; // search auto unpacked dir

  const taskManager = new (_builderUtil().AsyncTaskManager)(packager.cancellationToken);
  const createdParentDirs = new Set();
  const fileCopier = new (_fs().FileCopier)(file => {
    // https://github.com/electron-userland/electron-builder/issues/3038
    return !((0, _unpackDetector().isLibOrExe)(file) || file.endsWith(".node"));
  }, transformer);
  const links = [];

  for (let i = 0, n = fileSet.files.length; i < n; i++) {
    const sourceFile = fileSet.files[i];
    const stat = metadata.get(sourceFile);

    if (stat == null) {
      // dir
      continue;
    }

    const destinationFile = getDestinationPath(sourceFile, fileSet);

    if (stat.isSymbolicLink()) {
      links.push({
        file: destinationFile,
        link: await (0, _fsExtra().readlink)(sourceFile)
      });
      continue;
    }

    const fileParent = path.dirname(destinationFile);

    if (!createdParentDirs.has(fileParent)) {
      createdParentDirs.add(fileParent);
      await (0, _fsExtra().ensureDir)(fileParent);
    }

    taskManager.addTask(fileCopier.copy(sourceFile, destinationFile, stat));

    if (taskManager.tasks.length > _fs().MAX_FILE_REQUESTS) {
      await taskManager.awaitTasks();
    }
  }

  if (taskManager.tasks.length > 0) {
    await taskManager.awaitTasks();
  }

  if (links.length > 0) {
    await _bluebirdLst().default.map(links, it => (0, _fsExtra().symlink)(it.link, it.file), _fs().CONCURRENCY);
  }
} // used only for ASAR, if no asar, file transformed on the fly


async function transformFiles(transformer, fileSet) {
  if (transformer == null) {
    return;
  }

  let transformedFiles = fileSet.transformedFiles;

  if (fileSet.transformedFiles == null) {
    transformedFiles = new Map();
    fileSet.transformedFiles = transformedFiles;
  }

  const metadata = fileSet.metadata;
  await _bluebirdLst().default.filter(fileSet.files, (it, index) => {
    const fileStat = metadata.get(it);

    if (fileStat == null || !fileStat.isFile()) {
      return false;
    }

    const transformedValue = transformer(it);

    if (transformedValue == null) {
      return false;
    }

    if (typeof transformedValue === "object" && "then" in transformedValue) {
      return transformedValue.then(it => {
        if (it != null) {
          transformedFiles.set(index, it);
        }

        return false;
      });
    }

    transformedFiles.set(index, transformedValue);
    return false;
  }, _fs().CONCURRENCY);
}

async function computeFileSets(matchers, transformer, platformPackager, isElectronCompile) {
  const fileSets = [];
  const packager = platformPackager.info;

  for (const matcher of matchers) {
    const fileWalker = new (_AppFileWalker().AppFileWalker)(matcher, packager);
    const fromStat = await (0, _fs().statOrNull)(matcher.from);

    if (fromStat == null) {
      _builderUtil().log.debug({
        directory: matcher.from,
        reason: "doesn't exist"
      }, `skipped copying`);

      continue;
    }

    const files = await (0, _fs().walk)(matcher.from, fileWalker.filter, fileWalker);
    const metadata = fileWalker.metadata;
    fileSets.push(validateFileSet({
      src: matcher.from,
      files,
      metadata,
      destination: matcher.to
    }));
  }

  if (isElectronCompile) {
    // cache files should be first (better IO)
    fileSets.unshift((await compileUsingElectronCompile(fileSets[0], packager)));
  }

  return fileSets;
}

function getNodeModuleExcludedExts(platformPackager) {
  // do not exclude *.h files (https://github.com/electron-userland/electron-builder/issues/2852)
  const result = [".o", ".obj"].concat(_fileMatcher().excludedExts.split(",").map(it => `.${it}`));

  if (platformPackager.config.includePdb !== true) {
    result.push(".pdb");
  }

  if (platformPackager.platform !== _core().Platform.WINDOWS) {
    // https://github.com/electron-userland/electron-builder/issues/1738
    result.push(".dll");
    result.push(".exe");
  }

  return result;
}

function validateFileSet(fileSet) {
  if (fileSet.src == null || fileSet.src.length === 0) {
    throw new Error("fileset src is empty");
  }

  return fileSet;
}
/** @internal */


async function computeNodeModuleFileSets(platformPackager, mainMatcher) {
  const deps = await platformPackager.info.getNodeDependencyInfo(platformPackager.platform).value;
  const nodeModuleExcludedExts = getNodeModuleExcludedExts(platformPackager); // serial execution because copyNodeModules is concurrent and so, no need to increase queue/pressure

  const result = new Array();
  let index = 0;

  for (const info of deps) {
    const source = info.dir;
    let destination;

    if (source.length > mainMatcher.from.length && source.startsWith(mainMatcher.from) && source[mainMatcher.from.length] === path.sep) {
      destination = getDestinationPath(source, {
        src: mainMatcher.from,
        destination: mainMatcher.to,
        files: [],
        metadata: null
      });
    } else {
      destination = mainMatcher.to + path.sep + "node_modules";
    } // use main matcher patterns, so, user can exclude some files in such hoisted node modules
    // source here includes node_modules, but pattern base should be without because users expect that pattern "!node_modules/loot-core/src{,/**/*}" will work


    const matcher = new (_fileMatcher().FileMatcher)(path.dirname(source), destination, mainMatcher.macroExpander, mainMatcher.patterns);
    const copier = new (_NodeModuleCopyHelper().NodeModuleCopyHelper)(matcher, platformPackager.info);
    const files = await copier.collectNodeModules(source, info.deps.map(it => it.name), nodeModuleExcludedExts);
    result[index++] = validateFileSet({
      src: source,
      destination,
      files,
      metadata: copier.metadata
    });
  }

  return result;
}

async function compileUsingElectronCompile(mainFileSet, packager) {
  _builderUtil().log.info("compiling using electron-compile");

  const electronCompileCache = await packager.tempDirManager.getTempDir({
    prefix: "electron-compile-cache"
  });
  const cacheDir = path.join(electronCompileCache, ".cache"); // clear and create cache dir

  await (0, _fsExtra().ensureDir)(cacheDir);
  const compilerHost = await (0, _fileTransformer().createElectronCompilerHost)(mainFileSet.src, cacheDir);
  const nextSlashIndex = mainFileSet.src.length + 1; // pre-compute electron-compile to cache dir - we need to process only subdirectories, not direct files of app dir

  await _bluebirdLst().default.map(mainFileSet.files, file => {
    if (file.includes(_fileTransformer().NODE_MODULES_PATTERN) || file.includes(BOWER_COMPONENTS_PATTERN) || !file.includes(path.sep, nextSlashIndex) // ignore not root files
    || !mainFileSet.metadata.get(file).isFile()) {
      return null;
    }

    return compilerHost.compile(file).then(() => null);
  }, _fs().CONCURRENCY);
  await compilerHost.saveConfiguration();
  const metadata = new Map();
  const cacheFiles = await (0, _fs().walk)(cacheDir, file => !file.startsWith("."), {
    consume: (file, fileStat) => {
      if (fileStat.isFile()) {
        metadata.set(file, fileStat);
      }

      return null;
    }
  }); // add shim

  const shimPath = `${mainFileSet.src}${path.sep}${ELECTRON_COMPILE_SHIM_FILENAME}`;
  mainFileSet.files.push(shimPath);
  mainFileSet.metadata.set(shimPath, {
    isFile: () => true,
    isDirectory: () => false,
    isSymbolicLink: () => false
  });

  if (mainFileSet.transformedFiles == null) {
    mainFileSet.transformedFiles = new Map();
  }

  mainFileSet.transformedFiles.set(mainFileSet.files.length - 1, `
'use strict';
require('electron-compile').init(__dirname, require('path').resolve(__dirname, '${packager.metadata.main || "index"}'), true);
`);
  return {
    src: electronCompileCache,
    files: cacheFiles,
    metadata,
    destination: mainFileSet.destination
  };
} 
// __ts-babel@6.0.4
//# sourceMappingURL=appFileCopier.js.map