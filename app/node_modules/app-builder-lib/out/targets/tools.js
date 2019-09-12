"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLinuxToolsPath = getLinuxToolsPath;

function _binDownload() {
  const data = require("../binDownload");

  _binDownload = function () {
    return data;
  };

  return data;
}

function getLinuxToolsPath() {
  //noinspection SpellCheckingInspection
  return (0, _binDownload().getBinFromUrl)("linux-tools", "mac-10.12.3", "SQ8fqIRVXuQVWnVgaMTDWyf2TLAJjJYw3tRSqQJECmgF6qdM7Kogfa6KD49RbGzzMYIFca9Uw3MdsxzOPRWcYw==");
} 
// __ts-babel@6.0.4
//# sourceMappingURL=tools.js.map