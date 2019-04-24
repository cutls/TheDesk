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
        <div v-for="[id,status] in Array.from(value.statuses)" :key="id" class="tl">{{status.id}}</div>
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

type DeleteListener = (e: Event, id: number) => void
type Instance = string
type Timeline = {
  name: string
  statuses?: Map<number, Status>
}
type Timelines = Timeline[]
type UpdateListener = (e: Event, status: Status) => void

@Component
export default class AddColumn extends Vue {
  public instance: Instance = ''
  public showInput: boolean = true
  public updateListeners: [string, UpdateListener][] = []
  public deleteListeners: [string, DeleteListener][] = []
  public pubTL: Timelines = []

  beforeDestroy() {
    this.updateListeners.forEach(([name, listener]) => {
      ipcRenderer.removeListener(name, listener)
    })
    this.deleteListeners.forEach(([name, listener]) => {
      ipcRenderer.removeListener(name, listener)
    })
  }

  public get hasDomain() {
    return this.instance != ''
  }

  public addTL() {
    let timeline: Timeline = { name: this.instance }

    this.showInput = false
    this.instance = ''

    this.pubTL.push(timeline)
    // 最新のTLを取得
    this.loadTL(timeline)

    // streamingを開始
    this.subscribeStreaming(timeline)
  }

  public loadTL(timeline: Timeline) {
    let statuses: Status[] = ipcRenderer.sendSync('no-auth-timeline', timeline.name)
    timeline.statuses = new Map(statuses.map((status): [number, Status] => [status.id, status]))
  }

  public async subscribeStreaming(timeline: Timeline) {
    // updateイベントを購読
    let updateListener = (_: Event, status: Status) => {
      if (timeline.statuses === undefined) {
        timeline.statuses = new Map()
      }
      timeline.statuses.set(status.id, status)
      this.$forceUpdate()
    }
    ipcRenderer.on(`update-${timeline.name}-no-auth`, updateListener)
    this.updateListeners.push([`update-${timeline.name}-no-auth`, updateListener])

    // deleteイベントを購読
    let deleteListener = (_: Event, id: number) => {
      if (timeline.statuses === undefined) {
        timeline.statuses = new Map()
      }
      timeline.statuses.delete(id)
      this.$forceUpdate()
    }
    ipcRenderer.on(`delete-${timeline.name}-no-auth`, deleteListener)
    this.deleteListeners.push([`delete-${timeline.name}-no-auth`, deleteListener])

    ipcRenderer.send('open-streaming', timeline.name, 'no-auth')
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