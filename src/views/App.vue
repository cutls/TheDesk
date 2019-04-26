<template>
  <div id="app" :style="styles">
    <Welcome v-if="isStartup"/>
    <Main v-else/>
  </div>
</template>

<script lang="ts">
import { ipcRenderer } from 'electron'
import { Component, Vue } from 'vue-property-decorator'

import Main from '@/components/Main.vue'
import Welcome from '@/components/Welcome.vue'

@Component({
  components: {
    Main,
    Welcome,
  },
})
export default class App extends Vue {
  public isDarkMode!: boolean
  public isStartup!: boolean
  public fontSize!: string

  public get styles(): { [key: string]: string } {
    return {
      '--color': this.isDarkMode ? 'white' : 'black',
      '--bg-color': this.isDarkMode ? '#212121' : 'white',
      '--font-size': this.fontSize,
    }
  }

  created() {
    this.isDarkMode = ipcRenderer.sendSync('dark-theme')
    this.isStartup = true // TODO: ipcで初回起動かのboolean値を取得する
    this.fontSize = '16px'
  }

  mounted() {
    ipcRenderer.on('change-color-theme', () => this.isDarkMode = ipcRenderer.sendSync('dark-theme'))
    // TODO: アカウントか公開TLの追加を確認する。初回起動時のみ
    if (this.isStartup) {
      //ipcRenderer.once('add-timeline', () => this.isStartup = false)
    }
  }

  beforeDestroy() {
    ipcRenderer.eventNames().forEach(name => ipcRenderer.removeAllListeners(name))
  }
}
</script>

<style>
html {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
}
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100vh;
}
#app {
  color: var(--color);
  background-color: var(--bg-color);
  font-size: var(--font-size);

  text-align: center;
  height: 100%;
}
</style>
