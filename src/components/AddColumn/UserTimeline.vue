<template>
  <div>
    <form @submit.prevent="addTL">
      <label v-for="(type) in timelineTypes" :key="type" :class="{selected: type === timelineType}">
        <input type="radio" :value="type" v-model="timelineType">
        {{ timelineTypeNames[type] }}
      </label>
      <BaseButton
        type="submit"
        class="primary fill"
        style="--font-size:.8em;margin-top:1em;"
      >Add Column</BaseButton>
    </form>
  </div>
</template>

<script lang="ts">
import { ipcRenderer } from "electron"
import { Component, Prop, Vue } from "vue-property-decorator"

type TimelineType = 'home' | 'notify' | 'dm' | 'local' | 'federated' | 'integrated' | 'localPlus'

@Component
export default class UserTimeline extends Vue {
  @Prop() public username!: string

  public timelineTypes: TimelineType[] = [
    'home',
    'notify',
    'dm',
    'local',
    'federated',
    'integrated',
    'localPlus'
  ]

  public timelineTypeNames: { [key: string]: string } = {
    home: "Home Timeline",
    notify: "Notifications",
    dm: "Direct Messages",
    local: "Local Timeline",
    federated: "Federated Timeline",
    integrated: "Integrated Timeline (Home + Local)",
    localPlus: "Integrated Timeline (Local + Boost + Reply)"
  }

  public timelineType: TimelineType = "home"

  public addTL() {
    ipcRenderer.send("add-timeline", this.username, this.timelineType)
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
</style>