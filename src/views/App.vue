<template>
  <div id="app" :style="styles">
    <Welcome/>
  </div>
</template>

<script lang="ts">
import { remote } from 'electron'
import { Component, Vue } from 'vue-property-decorator'
import Welcome from '@/components/Welcome.vue'

@Component({
  components: {
    Welcome,
  },
})
export default class App extends Vue {
  public color: string = this.isDarkMode ? 'white' : 'black'
  public backgroundColor: string = this.isDarkMode ? '#212121' : 'white'
  public fontSize: string = '16px'

  public get styles(): { [key: string]: string } {
    return {
      '--color': this.color,
      '--bg-color': this.backgroundColor,
      '--font-size': this.fontSize,
    }
  }

  public get isDarkMode(): boolean {
    return remote.systemPreferences.isDarkMode()
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
