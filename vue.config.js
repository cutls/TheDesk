
module.exports = {
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
        productName: "TheDesk Vue",
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
