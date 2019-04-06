
const { productName } = require("./package.json")

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
        appId: "dev.kpherox.thedesk-vue",
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
