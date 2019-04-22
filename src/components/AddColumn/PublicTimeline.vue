<template>
  <div>
    <input type="text" placeholder="e.g:mstdn.jp">
    <BaseButton
      @click.native="status = 'public_timeline'"
      class="primary fill"
      style="font-size:.8em;"
    >Add Column</BaseButton>
  </div>
</template>

<script lang="ts">
import { ipcRenderer } from 'electron'
import { Component, Vue } from 'vue-property-decorator'

type Status = 'welcome' | 'login' | 'public_timeline'

@Component
export default class AddColumn extends Vue {
  public status: Status = 'welcome'
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
</style>