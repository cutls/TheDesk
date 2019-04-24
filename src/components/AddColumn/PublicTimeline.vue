<template>
  <div>
    <div v-if="showInput">
      <form @submit.prevent="addTL">
        <input type="text" placeholder="e.g:mstdn.jp" v-model="instance">
        <BaseButton
          type="submit"
          class="primary fill"
          style="--font-size:.8em;"
          :disabled="!hasDomain"
        >Add Column</BaseButton>
      </form>
    </div>
    <div id="timelines">
      <div v-for="(value, key, index) in pubTL" :key="index" class="tl">
        {{value.name}}
        <div v-for="(status, key, index) in value.statuses" :key="index" class="tl">{{status.id}}</div>
      </div>
    </div>
    <BaseButton
      v-if="!showInput"
      @click.native="showInput = true"
      class="primary fill"
      style="--font-size:.8em;"
    >Show Menu</BaseButton>
  </div>
</template>

<script lang="ts">
import { ipcRenderer } from 'electron'
import { Component, Vue } from 'vue-property-decorator'
import { Status } from 'megalodon'

type Instance = string
type Timeline = {
  name: string
  statuses: Status[]
}
type UpdateListener = (e: Event, status: Status) => void
type Timelines = Timeline[]
@Component
export default class AddColumn extends Vue {
  public instance: Instance = ''
  public showInput: boolean = true
  public updateListeners: [string, UpdateListener][] = []
  public pubTL: Timelines = []

  beforeDestroy() {
    this.updateListeners.forEach(([name, listener]) => {
      ipcRenderer.removeListener(name, listener)
    })
  }

  public get hasDomain() {
    return this.instance != ''
  }

  public addTL() {
    this.showInput = false
    let instance = this.instance

    this.pubTL.push({ name: instance, statuses: [] })
    this.timeline()

    let updateListener = (_: Event, status: Status) => {
      this.pubTL.filter(tl => tl.name === instance).forEach(function (tl) {
        tl.statuses.unshift(status)
      })
      this.$forceUpdate()
    }
    ipcRenderer.on(`update-${instance}-no-auth`, updateListener)
    this.updateListeners.push([`update-${instance}-no-auth`, updateListener])

    ipcRenderer.send('open-streaming', instance, 'no-auth')
  }

  public timeline() {
    this.pubTL.forEach(function (tl) {
      ipcRenderer.on(`timeline-${tl.name}-no-auth`, (_: Event, statuses: Status[]) => {
        tl.statuses = statuses
      })
      ipcRenderer.send('no-auth-timeline', tl.name)
    })
  }
}
</script>=

<style scoped lang="postcss">
input {
  color: var(--color);
  background-color: transparent;
  font-size: var(--font-size);
  border: none;
  border-bottom: 1px solid #9e9e9e;
  border-radius: 0;
  line-height: 3em;
  width: 80%;
  outline: none;
  margin: 1em;

  transition-duration: 0.5s;

  &:focus {
    border-color: #26d69a;
  }
}
#timelines {
  display: flex;
  width: 100%;
}
.tl {
  height: 100%;
  flex-grow: 4;
}
</style>