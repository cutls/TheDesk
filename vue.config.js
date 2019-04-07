
const { productName } = require("./package.json")
const { appId, copyright } = require("./info.json")

module.exports = {
  pages: {
    index: {
      entry: 'src/index/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: productName,
    },
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require('autoprefixer')({}),
        ],
      },
    },
  },
  pluginOptions: {
    electronBuilder: {
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
