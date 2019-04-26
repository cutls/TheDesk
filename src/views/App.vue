<template>
  <div id="app" :style="styles">
    <Welcome/>
  </div>
</template>

<script lang="ts">
import { ipcRenderer } from 'electron'
import { Component, Vue } from 'vue-property-decorator'
import Welcome from '@/components/Welcome.vue'

@Component({
  components: {
    Welcome,
  },
})
export default class App extends Vue {
  public isDarkMode!: boolean
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
    this.fontSize = '16px'
  }

  mounted() {
    ipcRenderer.on('change-color-theme', () => this.isDarkMode = ipcRenderer.sendSync('dark-theme'))
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
