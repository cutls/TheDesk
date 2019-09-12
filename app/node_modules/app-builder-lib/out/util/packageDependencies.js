"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createLazyProductionDeps = createLazyProductionDeps;

function _lazyVal() {
  const data = require("lazy-val");

  _lazyVal = function () {
    return data;
  };

  return data;
}

function _appBuilder() {
  const data = require("./appBuilder");

  _appBuilder = function () {
    return data;
  };

  return data;
}

function createLazyProductionDeps(projectDir, excludedDependencies) {
  return new (_lazyVal().Lazy)(async () => {
    const args = ["node-dep-tree", "--dir", projectDir];

    if (excludedDependencies != null) {
      for (const name of excludedDependencies) {
        args.push("--exclude-dep", name);
      }
    }

    return (0, _appBuilder().executeAppBuilderAsJson)(args);
  });
} 
// __ts-babel@6.0.4
//# sourceMappingURL=packageDependencies.js.map