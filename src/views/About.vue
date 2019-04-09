<template>
  <div id="about">
    <div id="brand">
      <div id="logo">
        <img :alt="productName+' logo'" src="@/assets/logo.png" width="194" draggable="false">
      </div>
      <p id="app-name">{{ productName }}</p>
      <p id="web-site">
        <a :href="homePage">Web site</a>
      </p>
    </div>
    <dl class="version">
      <template v-for="(version, name, i) in versions">
        <dt :key="'name-'+i">{{ name }}</dt>
        <dd :key="'ver-'+i">{{ version }}</dd>
      </template>
    </dl>
    <div id="copyright">
      <small>{{ copyright }}</small>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import { ipcRenderer } from "electron"

type Versions = {[key: string]: string}

@Component
export default class About extends Vue {
  public productName: string
  public homePage: string
  public copyright: string
  public versions: Versions

  constructor() {
    super()
    let { productName, homePage, copyright, codeName, versions } = ipcRenderer.sendSync('thedesk-info')
    this.productName = productName
    this.homePage = homePage
    this.copyright = copyright
    this.versions = {
      "Code Name": codeName,
      "Internal Version": versions.internal,
      "Chromium": versions.chrome,
      "Electron": versions.electron,
      "Node.js": versions.node,
    }
  }
}
</script>

<style lang="postcss">
body {
  margin: 0;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -webkit-app-region: drag;
  user-select: none;
}
#about {
  padding: 0.5em;
  text-align: center;
}
#brand {
  margin-top: 0.5em;
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
  user-select: text;
  padding: 0.5em;
  dt,
  dd {
    margin-left: 0;
    line-height: 1.5em;
  }
}
</style>