<template>
  <div>
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
</template>

<script lang="ts">
import { ipcRenderer } from "electron"
import { Component, Vue } from "vue-property-decorator"

@Component
export default class PublicTimeline extends Vue {
  public instance: string = ""

  public get hasDomain() {
    return this.instance != ""
  }

  public addTL() {
    ipcRenderer.send("add-timeline", this.instance, 'no-auth')

    this.instance = ""
  }
}
</script>

<style scoped lang="postcss">
</style>