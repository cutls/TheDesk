<template>
  <div>
    <div>
      <form @submit.prevent="addTL">
        <label
          v-for="(types,name) in userTimelineTypes"
          :key="name"
          :class="{selected: name === timelineType}"
        >
          <input type="radio" :value="name" v-model="timelineType">
          {{ types }}
        </label>
        <BaseButton
          type="submit"
          class="primary fill"
          style="--font-size:.8em;margin-top:1em;"
        >Add Column</BaseButton>
      </form>
    </div>
    <div id="timelines">
      <div v-for="(value, key, index) in TL" :key="index" class="tl">
        {{value.name}}/{{value.type}}
        <TimelineToot
          v-for="[id,status] in value.statuses"
          :key="id"
          :status="status"
          :pref-static="pref.static"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ipcRenderer } from "electron"
import { Status } from "megalodon"
import { Component, Prop, Vue } from "vue-property-decorator"
import TimelineToot from "@/components/Timeline/Toot.vue"
type Timeline = {
  name: string
  type: string
  statuses: Map<number, Status>
  error?: Error
}
type Timelines = Timeline[]
type DeleteListener = (e: Event, id: number) => void
type UpdateListener = (e: Event, status: Status) => void

@Component({
  components: {
    TimelineToot
  }
})
export default class UserTimeline extends Vue {
  @Prop() public username!: string
  public deleteListeners: [string, DeleteListener][] = []
  public updateListeners: [string, UpdateListener][] = []
  public timelineType: string = "home"
  public userTimelineTypes: { [key: string]: string } = {
    home: "Home Timeline",
    notify: "Notifications",
    dm: "Direct Messages",
    local: "Local Timeline",
    fediverse: "Fediverse Timeline",
    integrated: "Integrated Timeline (Home + Local)",
    localPlus: "Integrated Timeline (Local + Boost + Reply)"
  }
  public TL: Timelines = []
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
  public sortedStatus(statuses: Map<number, Status>): Map<number, Status> {
    return statuses.sortByValue(
      (s1, s2): number => {
        return s1.created_at > s2.created_at ? -1 : 1
      }
    )
  }
  public addTL() {
    let timeline: Timeline = {
      name: this.username,
      type: this.timelineType,
      statuses: new Map()
    }
    this.TL.push(timeline)
    // 最新のTLを取得
    ipcRenderer.once(
      `timeline-${timeline.name}-${timeline.type}`,
      (e: Event, statuses: Status[], error?: Error) => {
        timeline.error = error
        if (error === undefined) {
          this.loadTL(timeline, statuses)
        }
        this.$forceUpdate()
      }
    )
    ipcRenderer.send("timeline", timeline.name, timeline.type)
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
    ipcRenderer.on(`update-${timeline.name}-${timeline.type}`, updateListener)
    this.updateListeners.push([
      `update-${timeline.name}-${timeline.type}`,
      updateListener
    ])

    // deleteイベントを購読
    let deleteListener = (_: Event, id: number) => {
      timeline.statuses.delete(id)
      this.$forceUpdate()
    }
    ipcRenderer.on(`delete-${timeline.name}-${timeline.type}`, deleteListener)
    this.deleteListeners.push([
      `delete-${timeline.name}-${timeline.type}`,
      deleteListener
    ])

    ipcRenderer.send("open-streaming", timeline.name, timeline.type)
  }

  public showAccount(id: number) {
    console.log("Account dialog:" + id)
  }
}
</script>

<style scoped lang="postcss">
label {
  display: block;
  line-height: 2em;
  margin: 0em;

  &:hover {
    background-color: gray;
  }

  &.selected {
    background-color: maroon;
  }

  & > input[type="radio"] {
    display: none;
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