
const { productName } = require("./package.json")
const { appId, copyright } = require("./info.json")

module.exports = {
  pages: {
    index: {
      entry: 'src/index/main.js',
      template: 'public/index.html',
      title: productName,
    },
    about: {
      entry: 'src/about/main.js',
      template: 'public/index.html',
      title: `About`,
    },
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require('postcss-nested')(),
          require('autoprefixer')({}),
          require('CSSWring')(),
        ],
      },
    },
  },
  pluginOptions: {
    electronBuilder: {
      disableMainProcessTypescript: false,
      mainProcessTypeChecking: true,
      builderOptions: {
        appId: appId,
        copyright: copyright,
        win: {
          "target": [
            "nsis",
            "portable",
          ],
        },
        nsis: {
          oneClick: false,
          allowToChangeInstallationDirectory: true,
          artifactName: "TheDesk-Vue-setup.${ext}",
        },
        linux: {
          target: [
            "snap",
          ],
          category: "Network",
        },
        mac: {
          target: [
            "dmg",
          ],
        },
      },
    },
  },
}
