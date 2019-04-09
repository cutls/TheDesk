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
      <template v-for="(version, i) in versions">
        <dt :key="'name-'+i">{{ version.name }}</dt>
        <dd :key="'ver-'+i">{{ version.version }}</dd>
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

<script lang="ts">
import { Component, Vue } from "vue-property-decorator"
import { ipcRenderer } from "electron"

interface Version {
  name: string
  version: string
}

@Component
export default class About extends Vue {
  public productName: string
  public homePage: string
  public copyright: string
  public versions: Version[]

  constructor() {
    super()
    let { productName, homePage, copyright, codeName, versions } = ipcRenderer.sendSync('thedesk-info')
    this.productName = productName
    this.homePage = homePage
    this.copyright = copyright
    this.versions = [
      {
        name: "Code Name",
        version: codeName,
      },
      {
        name: "Internal Version",
        version: versions.internal,
      },
      {
        name: "Chromium",
        version: versions.chrome,
      },
      {
        name: "Electron",
        version: versions.electron,
      },
      {
        name: "Node.js",
        version: versions.node,
      },
    ]
  }
}
</script>
