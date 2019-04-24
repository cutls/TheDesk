<template>
  <form @submit.prevent="authCode" v-if="inputCode">
    <input type="text" placeholder="input code" v-model="code">
    <BaseButton
      type="submit"
      class="primary fill"
      style="--font-size:.8em;"
      :disabled="!hasDomain"
    >Auth</BaseButton>
  </form>
  <form @submit.prevent="addAccount" v-else>
    <input type="text" placeholder="e.g:mstdn.jp" v-model="instance">
    <BaseButton
      type="submit"
      class="primary fill"
      style="--font-size:.8em;"
      :disabled="!hasDomain"
    >Login</BaseButton>
  </form>
</template>
<script lang="ts">
import { ipcRenderer } from "electron"
import { Component, Vue } from "vue-property-decorator"
type Instance = string
@Component
export default class Auth extends Vue {
  public instance: Instance = ""
  public inputCode: boolean = false
  public get hasDomain() {
    return this.instance != ""
  }
  public addAccount() {
    let target = this.instance
    this.inputCode = true
    ipcRenderer.send(`new-account-setup`, target)
  }
  public authCode() {
    let code = this.code
    this.inputCode = true
    ipcRenderer.send(`new-account-setup`, target)
  }
}
</script>
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