<template>
  <div>
    <div v-if="showInput">
      <form @submit.prevent="addTL">
        <BaseInputText placeholder="e.g:mstdn.jp" v-model="instance"/>
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
        <!--とりあえずここに書かせて-->
        <TimelineToot
          v-for="[id,status] in value.statuses"
          :key="id"
          :status="status"
          :pref-static="pref.static"
        />
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
import { ipcRenderer } from "electron"
import { Component, Vue } from "vue-property-decorator"
import { Status } from "megalodon"

import TimelineToot from '@/components/Timeline/Toot.vue'

import "@/extensions/map-sortbyvalue" // Add sortByValue function to Map prototype

type DeleteListener = (e: Event, id: number) => void
type Instance = string
type Timeline = {
  name: string
  statuses: Map<number, Status>
  error?: Error
}
type Timelines = Timeline[]
type UpdateListener = (e: Event, status: Status) => void

@Component({
  components: {
    TimelineToot
  }
})
export default class PublicTimeline extends Vue {
  public instance: Instance = ""
  public showInput: boolean = true
  public updateListeners: [string, UpdateListener][] = []
  public deleteListeners: [string, DeleteListener][] = []
  public pubTL: Timelines = []
  //test
  public pref = {
    static: false
  }

  beforeDestroy() {
    this.updateListeners.forEach(([name, listener]) => {
      ipcRenderer.removeListener(name, listener)
    })
    this.deleteListeners.forEach(([name, listener]) => {
      ipcRenderer.removeListener(name, listener)
    })
  }

  public get hasDomain() {
    return this.instance != ""
  }

  public sortedStatus(statuses: Map<number, Status>): Map<number, Status> {
    return statuses.sortByValue(
      (s1, s2): number => {
        return s1.created_at > s2.created_at ? -1 : 1
      }
    )
  }

  public addTL() {
    let timeline: Timeline = { name: this.instance, statuses: new Map() }

    this.showInput = false
    this.instance = ""

    this.pubTL.push(timeline)
    // 最新のTLを取得
    ipcRenderer.once(`timeline-${timeline.name}-no-auth`, (e: Event, statuses: Status[], error?: Error) => {
      timeline.error = error
      if (error === undefined) {
        this.loadTL(timeline, statuses)
      }
      this.$forceUpdate()
    })
    ipcRenderer.send("no-auth-timeline", timeline.name)
  }

  public loadTL(timeline: Timeline, statuses: Status[]) {
    timeline.statuses = new Map(
      statuses.map((status): [number, Status] => [status.id, status])
    )

    // streamingを開始
    this.subscribeStreaming(timeline)
  }

  public async subscribeStreaming(timeline: Timeline) {
    // updateイベントを購読
    let updateListener = (_: Event, status: Status) => {
      timeline.statuses.set(status.id, status)
      timeline.statuses = this.sortedStatus(timeline.statuses)
      this.$forceUpdate()
    }
    ipcRenderer.on(`update-${timeline.name}-no-auth`, updateListener)
    this.updateListeners.push([
      `update-${timeline.name}-no-auth`,
      updateListener
    ])

    // deleteイベントを購読
    let deleteListener = (_: Event, id: number) => {
      timeline.statuses.delete(id)
      this.$forceUpdate()
    }
    ipcRenderer.on(`delete-${timeline.name}-no-auth`, deleteListener)
    this.deleteListeners.push([
      `delete-${timeline.name}-no-auth`,
      deleteListener
    ])

    ipcRenderer.send("open-streaming", timeline.name, "no-auth")
  }

  public showAccount(id: number) {
    console.log("Account dialog:" + id)
  }
}
</script>

<style scoped lang="postcss">
#timelines {
  display: flex;
  width: 100%;
}
.tl {
  height: 100%;
  flex-grow: 4;
}
</style>