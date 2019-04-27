<template>
  <div id="about" :style="styles">
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
    <div id="credits">
      <p id="copyright">
        <small>
          Copyright &copy; {{ copyrightYear }}
          <a :href="author.url">{{ author.name }}</a>
        </small>
      </p>
      <p id="thank">
        <small>
          Thanks
          <br>
          <span v-html="ctrHtml"></span>
          <br>and all users
          <img
            alt="❤️"
            title=":heart:"
            src="https://twemoji.maxcdn.com/2/72x72/2764.png"
            width="13"
            draggable="false"
          >
        </small>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { ipcRenderer } from 'electron'

type Versions = { [key: string]: string }

interface Maintainer {
  name: string
  url: string
  email: string
}
interface TheDeskInfo {
  productName: string
  author: Maintainer
  contributors: Maintainer[]
  homePage: string
  copyrightYear: string
  codeName: string
  versions: Versions
}

@Component
export default class About extends Vue {
  public thedeskInfo!: TheDeskInfo
  public isDarkMode!: boolean

  public get ctrHtml(): string {
    return this.contributors.map(contributer => {
      return `<a href="${contributer.url}" target="_blank">${contributer.name}</a>`
    }).join(', ')
  }

  public get productName(): string {
    return this.thedeskInfo.productName
  }
  public get author(): Maintainer {
    return this.thedeskInfo.author
  }
  public get contributors(): Maintainer[] {
    return this.thedeskInfo.contributors
  }
  public get homePage(): string {
    return this.thedeskInfo.homePage
  }
  public get copyrightYear(): string {
    return this.thedeskInfo.copyrightYear
  }
  public get versions(): Versions {
    return {
      "Code Name": this.thedeskInfo.codeName,
      "Internal Version": this.thedeskInfo.versions.internal,
      "Chromium": this.thedeskInfo.versions.chrome,
      "Electron": this.thedeskInfo.versions.electron,
      "Node.js": this.thedeskInfo.versions.node,
    }
  }

  public get styles(): { [key: string]: string } {
    return {
      '--color': this.isDarkMode ? 'white' : 'black',
      '--bg-color': this.isDarkMode ? '#212121' : 'white',
    }
  }

  created() {
    this.thedeskInfo = ipcRenderer.sendSync('thedesk-info')
    this.isDarkMode = ipcRenderer.sendSync('dark-theme')
  }

  mounted() {
    ipcRenderer.on('change-color-theme', () => this.isDarkMode = ipcRenderer.sendSync('dark-theme'))
  }

  beforeDestroy() {
    ipcRenderer.eventNames().forEach(name => ipcRenderer.removeAllListeners(name))
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
a {
  color: #36c;
  text-decoration: none;
}
#about {
  padding: 0.5em;
  text-align: center;
  height: 100vh;
  color: var(--color);
  background-color: var(--bg-color);
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
#credits {
  p {
    margin: 0;
  }
}
dl.version {
  margin: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: 1.5em;
  text-align: left;
  -webkit-app-region: no-drag;
  user-select: text;
  padding: 0.5em 1em;
  dt,
  dd {
    margin-left: 0;
    line-height: 1.5em;
  }
}
</style>