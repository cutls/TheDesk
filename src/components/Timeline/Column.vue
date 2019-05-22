<template>
  <div class="timeline">
    <div class="header">
      <div class="tl-name">{{name}}</div>
    </div>
    <div class="toot-box">
      <Toot v-for="[id,status] in statuses" :key="id" :status="status" :pref-static="pref.static"/>
    </div>
  </div>
</template>

<script lang="ts">
import { ipcRenderer } from "electron"
import { Component, Prop, Vue } from "vue-property-decorator"
import { Status } from "megalodon"

import Toot from '@/components/Timeline/Toot.vue'

import "@/extensions/map-sortbyvalue" // Add sortByValue function to Map prototype

interface TimelineDoc {
  name: string
  type: string
}

type Statuses = Map<number, Status>

@Component({
  components: {
    Toot
  }
})
export default class Column extends Vue {
  @Prop({
    required: true
  }) public id!: string

  //test
  public pref = {
    static: false
  }

  public statuses: Statuses = new Map()

  public name!: string
  public type!: string

  beforeDestroy() {
    ipcRenderer.removeListener(`update-${this.name}-${this.type}`, this.updateListener)
    ipcRenderer.removeListener(`delete-${this.name}-${this.type}`, this.deleteListener)
  }

  public sortedStatus(statuses: Map<number, Status>): Map<number, Status> {
    return statuses.sortByValue(
      (s1, s2): number => {
        return s1.created_at > s2.created_at ? -1 : 1
      }
    )
  }

  created() {
    // timelineのnameとtypeをthis.idから取得する
    let doc: TimelineDoc = ipcRenderer.sendSync('get-timeline', this.id)
    this.name = doc.name
    this.type = doc.type
    // TODO: このイベントのchannel名、timelineのidがいいか？
    ipcRenderer.once(`timeline-${this.name}-${this.type}`, (e: Event, statuses: Status[], error?: Error) => {
      if (error === undefined) {
        this.loadTL(statuses)
      }
      this.$forceUpdate()
    })
  }

  mounted() {
    if (this.type === 'no-auth') {
      ipcRenderer.send("no-auth-timeline", this.name)
    } else {
      ipcRenderer.send("timeline", this.name, this.type)
    }
  }

  public updateListener(_: Event, status: Status) {
    this.statuses.set(status.id, status)
    this.statuses = this.sortedStatus(this.statuses)
    this.$forceUpdate()
  }

  public deleteListener(_: Event, id: number) {
    this.statuses.delete(id)
    this.$forceUpdate()
  }

  public loadTL(statuses: Status[]) {
    this.statuses = new Map(
      statuses.map((status): [number, Status] => [status.id, status])
    )

    // streamingを開始
    this.subscribeStreaming()
  }

  public async subscribeStreaming() {
    // updateイベントを購読
    ipcRenderer.on(`update-${this.name}-${this.type}`, (e: Event, status: Status) => this.updateListener(e, status))

    // deleteイベントを購読
    ipcRenderer.on(`delete-${this.name}-${this.type}`, (e: Event, id: number) => this.deleteListener(e, id))

    ipcRenderer.send("open-streaming", this.name, this.type)
  }

  public showAccount(id: number) {
    console.log("Account dialog:" + id)
  }
}
</script>

<style scoped lang="postcss">
.timeline {
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
  overflow: hidden;

  & + .timeline {
    border-left: solid 1px;
    border-right: none;
  }

  .header {
    top: 0;
    background-color: var(--header);
    filter: brightness(110%);

    .tl-name {
      height: 60px;
    }
  }

  .toot-box {
    flex: 1;
    overflow-x: hidden;
    overflow-y: scroll;
  }
}
</style>