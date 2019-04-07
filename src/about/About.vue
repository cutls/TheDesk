<template>
  <div id="about">
    <div id="brand">
      <div id="logo">
        <img :alt="productName+' logo'" src="@/assets/logo.png" width="194" draggable="false">
      </div>
      <p id="app-name">{{ productName }}</p>
      <p id="web-site">
        <a :href="homePage">
          Web site
        </a>
      </p>
    </div>
    <dl class="version">
      <template v-for="(name, idx) in versionInfo">
        <dt :key="'title-'+idx">{{ versionName[name] }}</dt>
        <dd :key="'desc-'+idx">{{ name !== "codeName" ? versions[name] : codeName }}</dd>
      </template>
    </dl>
    <div id="copyright">
      <small>{{ copyright }}</small>
    </div>
  </div>
</template>

<style lang="postcss">
body {
  margin: 0;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -webkit-app-region: drag;
  user-select: none;
}
#about {
  padding: .5em;
  text-align: center;
}
#brand {
  margin-top: .5em;
  & > p {
    margin: 0;
  }
}
#app-name {
  font-weight: bold;
}
#web-site {
  -webkit-app-region: no-drag;
  user-select: auto;
}
dl.version {
  margin: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: 1.5em;
  text-align: left;
  -webkit-app-region: no-drag;
  user-select: all;
  padding: .5em;
  dt, dd {
    margin-left: 0;
    line-height: 1.5em;
  }
}
</style>

<script>
import { remote } from 'electron'

export default {
  name: 'about',
  data() {
    return Object.assign({
      versionName: {
        codeName: "Code Name",
        internal: "Internal Version",
        chrome: "Chromium",
        electron: "Electron",
        node: "Node.js",
      },
      versionInfo: [ "codeName", "internal", "chrome", "electron", "node" ]
    }, JSON.parse(remote.getGlobal('TheDeskInfo')))
  },
}
</script>
