<template>
  <div id="main">
    <!-- idを渡してそのIDのTL情報をとってきてもらうつもり -->
    <div id="timelines">
      <Column v-for="id in timelines" :key="id" :id="id"/>
    </div>
    <div id="toolbar"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

import Column from '@/components/Timeline/Column.vue'

interface TimelineDoc {
  _id: string
  name: string
  type: string
}

@Component({
  components: {
    Column,
  }
})
export default class Main extends Vue {
  @Prop() public initTimeline?: TimelineDoc

  public timelines: string[] = []

  beforeDestroy() {
    // this.timelines を LocalStorage とかに保持させる
  }

  created() {
    if (this.initTimeline === undefined) {
      // LocalStorage から this.timelines に順番を入れる
      return
    }

    this.timelines.push(this.initTimeline._id)
  }
}
</script>

<style lang="postcss">
#main {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
#timelines {
  display: flex;
  width: 100%;
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
}
#toolbar {
  width: 100vw;
  height: 40px;
  background-color: var(--toolbar);
}
</style>