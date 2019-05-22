<template>
  <div id="app" :style="styles">
    <Welcome v-if="isStartup"/>
    <Main :init-timeline-id="initTimelineId" v-else/>
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
  public isDarkMode: boolean = false
  public isStartup: boolean = true
  public fontSize: string = '16px'
  public initTimelineId?: string

  public get styles(): { [key: string]: string } {
    return {
      '--color': this.isDarkMode ? 'white' : 'black',
      '--bg-color': this.isDarkMode ? '#212121' : 'white',
      '--toolbar': this.isDarkMode ? '#424242' : '#eeeeee',
      '--header': this.isDarkMode ? '#333333' : 'white',
      '--font-size': this.fontSize,
    }
  }

  created() {
    this.isDarkMode = ipcRenderer.sendSync('dark-theme')
    this.isStartup = ipcRenderer.sendSync('is-startup') // TODO: ipcで初回起動かのboolean値を取得する
  }

  mounted() {
    ipcRenderer.on('change-color-theme', () => this.isDarkMode = ipcRenderer.sendSync('dark-theme'))
    // TODO: アカウントか公開TLの追加を確認する。初回起動時のみ
    if (this.isStartup) {
      ipcRenderer.once('add-timeline', (_e: Event, id?: string, error?: Error) => {
        if (error != undefined) {
          console.error(error)
          return
        }
        this.initTimelineId = id
        this.isStartup = false
      })
    }
  }

  beforeDestroy() {
    ipcRenderer.eventNames().forEach(name => ipcRenderer.removeAllListeners(name))
  }
}
</script>

<style>
#app {
  color: var(--color);
  background-color: var(--bg-color);
  font-size: var(--font-size);

  text-align: center;
  height: 100%;
}
</style>
