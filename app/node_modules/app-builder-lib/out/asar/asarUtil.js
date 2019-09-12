"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AsarPackager = void 0;

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

var _fs2 = require("fs");

function _fsExtra() {
  const data = require("fs-extra");

  _fsExtra = function () {
    return data;
  };

  return data;
}

var path = _interopRequireWildcard(require("path"));

function _appFileCopier() {
  const data = require("../util/appFileCopier");

  _appFileCopier = function () {
    return data;
  };

  return data;
}

function _asar() {
  const data = require("./asar");

  _asar = function () {
    return data;
  };

  return data;
}

function _unpackDetector() {
  const data = require("./unpackDetector");

  _unpackDetector = function () {
    return data;
  };

  return data;
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const pickle = require("chromium-pickle-js");
/** @internal */


class AsarPackager {
  constructor(src, destination, options, unpackPattern) {
    this.src = src;
    this.destination = destination;
    this.options = options;
    this.unpackPattern = unpackPattern;
    this.fs = new (_asar().AsarFilesystem)(this.src);
    this.outFile = path.join(destination, "app.asar");
    this.unpackedDest = `${this.outFile}.unpacked`;
  } // sort files to minimize file change (i.e. asar file is not changed dramatically on small change)


  async pack(fileSets, packager) {
    if (this.options.ordering != null) {
      // ordering doesn't support transformed files, but ordering is not used functionality - wait user report to fix it
      await order(fileSets[0].files, this.options.ordering, fileSets[0].src);
    }

    await (0, _fsExtra().ensureDir)(path.dirname(this.outFile));
    const unpackedFileIndexMap = new Map();

    for (const fileSet of fileSets) {
      unpackedFileIndexMap.set(fileSet, (await this.createPackageFromFiles(fileSet, packager.info)));
    }

    await this.writeAsarFile(fileSets, unpackedFileIndexMap);
  }

  async createPackageFromFiles(fileSet, packager) {
    const metadata = fileSet.metadata; // search auto unpacked dir

    const unpackedDirs = new Set();
    const rootForAppFilesWithoutAsar = path.join(this.destination, "app");

    if (this.options.smartUnpack !== false) {
      await (0, _unpackDetector().detectUnpackedDirs)(fileSet, unpackedDirs, this.unpackedDest, rootForAppFilesWithoutAsar);
    }

    const dirToCreateForUnpackedFiles = new Set(unpackedDirs);

    const correctDirNodeUnpackedFlag = async (filePathInArchive, dirNode) => {
      for (const dir of unpackedDirs) {
        if (filePathInArchive.length > dir.length + 2 && filePathInArchive[dir.length] === path.sep && filePathInArchive.startsWith(dir)) {
          dirNode.unpacked = true;
          unpackedDirs.add(filePathInArchive); // not all dirs marked as unpacked after first iteration - because node module dir can be marked as unpacked after processing node module dir content
          // e.g. node-notifier/example/advanced.js processed, but only on process vendor/terminal-notifier.app module will be marked as unpacked

          await (0, _fsExtra().ensureDir)(path.join(this.unpackedDest, filePathInArchive));
          break;
        }
      }
    };

    const transformedFiles = fileSet.transformedFiles;
    const taskManager = new (_builderUtil().AsyncTaskManager)(packager.cancellationToken);
    const fileCopier = new (_fs().FileCopier)();
    let currentDirNode = null;
    let currentDirPath = null;
    const unpackedFileIndexSet = new Set();

    for (let i = 0, n = fileSet.files.length; i < n; i++) {
      const file = fileSet.files[i];
      const stat = metadata.get(file);

      if (stat == null) {
        continue;
      }

      const pathInArchive = path.relative(rootForAppFilesWithoutAsar, (0, _appFileCopier().getDestinationPath)(file, fileSet));

      if (stat.isSymbolicLink()) {
        const s = stat;
        this.fs.getOrCreateNode(pathInArchive).link = s.relativeLink;
        s.pathInArchive = pathInArchive;
        unpackedFileIndexSet.add(i);
        continue;
      }

      let fileParent = path.dirname(pathInArchive);

      if (fileParent === ".") {
        fileParent = "";
      }

      if (currentDirPath !== fileParent) {
        if (fileParent.startsWith("..")) {
          throw new Error(`Internal error: path must not start with "..": ${fileParent}`);
        }

        currentDirPath = fileParent;
        currentDirNode = this.fs.getOrCreateNode(fileParent); // do not check for root

        if (fileParent !== "" && !currentDirNode.unpacked) {
          if (unpackedDirs.has(fileParent)) {
            currentDirNode.unpacked = true;
          } else {
            await correctDirNodeUnpackedFlag(fileParent, currentDirNode);
          }
        }
      }

      const dirNode = currentDirNode;
      const newData = transformedFiles == null ? null : transformedFiles.get(i);
      const isUnpacked = dirNode.unpacked || this.unpackPattern != null && this.unpackPattern(file, stat);
      this.fs.addFileNode(file, dirNode, newData == null ? stat.size : Buffer.byteLength(newData), isUnpacked, stat);

      if (isUnpacked) {
        if (!dirNode.unpacked && !dirToCreateForUnpackedFiles.has(fileParent)) {
          dirToCreateForUnpackedFiles.add(fileParent);
          await (0, _fsExtra().ensureDir)(path.join(this.unpackedDest, fileParent));
        }

        const unpackedFile = path.join(this.unpackedDest, pathInArchive);
        taskManager.addTask(copyFileOrData(fileCopier, newData, file, unpackedFile, stat));

        if (taskManager.tasks.length > _fs().MAX_FILE_REQUESTS) {
          await taskManager.awaitTasks();
        }

        unpackedFileIndexSet.add(i);
      }
    }

    if (taskManager.tasks.length > 0) {
      await taskManager.awaitTasks();
    }

    return unpackedFileIndexSet;
  }

  writeAsarFile(fileSets, unpackedFileIndexMap) {
    return new Promise((resolve, reject) => {
      const headerPickle = pickle.createEmpty();
      headerPickle.writeString(JSON.stringify(this.fs.header));
      const headerBuf = headerPickle.toBuffer();
      const sizePickle = pickle.createEmpty();
      sizePickle.writeUInt32(headerBuf.length);
      const sizeBuf = sizePickle.toBuffer();
      const writeStream = (0, _fsExtra().createWriteStream)(this.outFile);
      writeStream.on("error", reject);
      writeStream.on("close", resolve);
      writeStream.write(sizeBuf);
      let fileSetIndex = 0;
      let files = fileSets[0].files;
      let metadata = fileSets[0].metadata;
      let transformedFiles = fileSets[0].transformedFiles;
      let unpackedFileIndexSet = unpackedFileIndexMap.get(fileSets[0]);

      const w = index => {
        while (true) {
          if (index >= files.length) {
            if (++fileSetIndex >= fileSets.length) {
              writeStream.end();
              return;
            } else {
              files = fileSets[fileSetIndex].files;
              metadata = fileSets[fileSetIndex].metadata;
              transformedFiles = fileSets[fileSetIndex].transformedFiles;
              unpackedFileIndexSet = unpackedFileIndexMap.get(fileSets[fileSetIndex]);
              index = 0;
            }
          }

          if (!unpackedFileIndexSet.has(index)) {
            break;
          } else {
            const stat = metadata.get(files[index]);

            if (stat != null && stat.isSymbolicLink()) {
              (0, _fs2.symlink)(stat.linkRelativeToFile, path.join(this.unpackedDest, stat.pathInArchive), () => w(index + 1));
              return;
            }
          }

          index++;
        }

        const data = transformedFiles == null ? null : transformedFiles.get(index);
        const file = files[index];

        if (data !== null && data !== undefined) {
          writeStream.write(data, () => w(index + 1));
          return;
        } // https://github.com/yarnpkg/yarn/pull/3539


        const stat = metadata.get(file);

        if (stat != null && stat.size < 2 * 1024 * 1024) {
          (0, _fsExtra().readFile)(file).then(it => {
            writeStream.write(it, () => w(index + 1));
          }).catch(e => reject(`Cannot read file ${file}: ${e.stack || e}`));
        } else {
          const readStream = (0, _fsExtra().createReadStream)(file);
          readStream.on("error", reject);
          readStream.once("end", () => w(index + 1));
          readStream.pipe(writeStream, {
            end: false
          });
        }
      };

      writeStream.write(headerBuf, () => w(0));
    });
  }

}

exports.AsarPackager = AsarPackager;

async function order(filenames, orderingFile, src) {
  const orderingFiles = (await (0, _fsExtra().readFile)(orderingFile, "utf8")).split("\n").map(line => {
    if (line.indexOf(":") !== -1) {
      line = line.split(":").pop();
    }

    line = line.trim();

    if (line[0] === "/") {
      line = line.slice(1);
    }

    return line;
  });
  const ordering = [];

  for (const file of orderingFiles) {
    const pathComponents = file.split(path.sep);

    for (const pathComponent of pathComponents) {
      ordering.push(path.join(src, pathComponent));
    }
  }

  const sortedFiles = [];
  let missing = 0;
  const total = filenames.length;

  for (const file of ordering) {
    if (!sortedFiles.includes(file) && filenames.includes(file)) {
      sortedFiles.push(file);
    }
  }

  for (const file of filenames) {
    if (!sortedFiles.includes(file)) {
      sortedFiles.push(file);
      missing += 1;
    }
  }

  _builderUtil().log.info({
    coverage: (total - missing) / total * 100
  }, "ordering files in ASAR archive");

  return sortedFiles;
}

function copyFileOrData(fileCopier, data, source, destination, stats) {
  if (data == null) {
    return fileCopier.copy(source, destination, stats);
  } else {
    return (0, _fsExtra().writeFile)(destination, data);
  }
} 
// __ts-babel@6.0.4
//# sourceMappingURL=asarUtil.js.map