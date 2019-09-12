"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BaseS3Publisher = void 0;

function _builderUtil() {
  const data = require("builder-util");

  _builderUtil = function () {
    return data;
  };

  return data;
}

function _electronPublish() {
  const data = require("electron-publish");

  _electronPublish = function () {
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

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

class BaseS3Publisher extends _electronPublish().Publisher {
  constructor(context, options) {
    super(context);
    this.options = options;
  }

  configureS3Options(args) {
    // if explicitly set to null, do not add
    if (this.options.acl !== null) {
      args.push("--acl", this.options.acl || "public-read");
    }
  } // http://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-creating-buckets.html


  async upload(task) {
    const fileName = path.basename(task.file);
    const cancellationToken = this.context.cancellationToken;
    const target = (this.options.path == null ? "" : `${this.options.path}/`) + fileName;
    const args = ["publish-s3", "--bucket", this.getBucketName(), "--key", target, "--file", task.file];
    this.configureS3Options(args);

    if (process.env.__TEST_S3_PUBLISHER__ != null) {
      const testFile = path.join(process.env.__TEST_S3_PUBLISHER__, target);
      await (0, _fsExtra().ensureDir)(path.dirname(testFile));
      await (0, _fsExtra().symlink)(task.file, testFile);
      return;
    } // https://github.com/aws/aws-sdk-go/issues/279


    this.createProgressBar(fileName, -1); // if (progressBar != null) {
    //   const callback = new ProgressCallback(progressBar)
    //   uploader.on("progress", () => {
    //     if (!cancellationToken.cancelled) {
    //       callback.update(uploader.loaded, uploader.contentLength)
    //     }
    //   })
    // }

    return await cancellationToken.createPromise((resolve, reject, onCancel) => {
      (0, _builderUtil().executeAppBuilder)(args, process => {
        onCancel(() => {
          process.kill("SIGINT");
        });
      }).then(() => {
        try {
          _builderUtil().log.debug({
            provider: this.providerName,
            file: fileName,
            bucket: this.getBucketName()
          }, "uploaded");
        } finally {
          resolve();
        }
      }).catch(reject);
    });
  }

  toString() {
    return `${this.providerName} (bucket: ${this.getBucketName()})`;
  }

} exports.BaseS3Publisher = BaseS3Publisher;
// __ts-babel@6.0.4
//# sourceMappingURL=BaseS3Publisher.js.map