<template>
  <div id="about">
    <div id="brand">
      <div id="logo">
        <img :alt="productName+' logo'" src="@/assets/logo.png" width="194" draggable="false">
      </div>
      <p id="app-name">{{ productName }}</p>
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
  margin-top: 1em;
  & > p {
    margin-top: 0;
  }
}
#app-name {
  font-weight: bold;
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
const appInfo = JSON.parse(remote.getGlobal('TheDeskInfo'))

export default {
  name: 'about',
  data() {
    return Object.assign(appInfo, {
      versionName: {
        codeName: "Code Name",
        internal: "Internal Version",
        chrome: "Chromium",
        electron: "Electron",
        node: "Node.js",
      },
      versionInfo: [ "codeName", "internal", "chrome", "electron", "node" ]
    })
  },
}
</script>
