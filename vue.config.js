const { productName, author } = require("./package.json");
const { appId, copyrightYear } = require("./info.json");

module.exports = {
  pages: {
    index: {
      entry: 'src/entries/main.ts',
      template: 'public/index.html',
      title: productName,
    },
    about: {
      entry: 'src/entries/about.ts',
      title: 'About',
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
        copyright: `Copyright © ${copyrightYear} ${author.name}`,
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
          darkModeSupport: true,
          target: [
            "dmg",
          ],
        },
      },
    },
  },
};