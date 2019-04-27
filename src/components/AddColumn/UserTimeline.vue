<template>
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
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator"

@Component
export default class UserTimeline extends Vue {
  @Prop() public username!: string

  public timelineType: string = 'home'
  public userTimelineTypes: {
    [key: string]: string
  } = {
      home: 'Home Timeline',
      notify: 'Notifications',
      dm: 'Direct Messages',
      local: 'Local Timeline',
      fediverse: 'Fediverse Timeline',
      integrated: 'Integrated Timeline (Home + Local)',
      localPlus: 'Integrated Timeline (Local + Boost + Reply)',
    }

  public addTL() {
    console.log(this.timelineType)
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