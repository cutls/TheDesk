<template>
  <form @submit.prevent="authCode" v-if="inputCode">
    <BaseInputText placeholder="input code" v-model="code"/>
    <BaseButton
      type="submit"
      class="primary fill"
      style="--font-size:.8em;"
      :disabled="this.code === ''"
    >Auth</BaseButton>
  </form>
  <form @submit.prevent="addAccount" v-else>
    <BaseInputText placeholder="e.g:mstdn.jp" v-model="domain"/>
    <BaseButton
      type="submit"
      class="primary fill"
      style="--font-size:.8em;"
      :disabled="this.domain === ''"
    >Login</BaseButton>
  </form>
</template>
<script lang="ts">
import { ipcRenderer } from "electron"
import { Component, Vue } from "vue-property-decorator"
type Instance = string
@Component
export default class Auth extends Vue {
  public instance: Instance = ''
  public code: string = ''
  public domain: string = ''

  public get inputCode(): boolean {
    return this.instance !== ''
  }

  public addAccount() {
    this.instance = this.domain
    this.domain = ''
    ipcRenderer.send(`new-account-setup`, this.instance)
  }
  public authCode() {
    let code = this.code
    ipcRenderer.send(`new-account-auth`, code, this.instance)
    this.instance = ''
  }
}
</script>

<style scoped lang="postcss">
</style>