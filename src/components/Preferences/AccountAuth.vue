<template>
  <div v-if="useURLScheme && inputCode">Wait Authorize TheDesk.</div>
  <form @submit.prevent="authCode" v-else-if="inputCode">
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
    <label>
      <input type="checkbox" v-model="useURLScheme">Use URL Scheme
    </label>
  </form>
</template>

<script lang="ts">
import { ipcRenderer } from "electron"
import { Component, Vue } from "vue-property-decorator"

type Instance = string
interface Account {
  domain: string
  acct: string
  avatar: string
  avatarStatic: string
  accessToken?: string
}

@Component
export default class AccountAuth extends Vue {
  public instance: Instance = ""
  public code: string = ""
  public domain: string = ""
  public useURLScheme: boolean = false

  public get inputCode(): boolean {
    return this.instance !== ""
  }

  public addAccount() {
    this.instance = this.domain
    this.domain = ""
    if (this.useURLScheme) {
      ipcRenderer.once('open-url-scheme', (e: Event, urlString: string) => {
        let url: URL = new URL(urlString)
        let params: URLSearchParams = url.searchParams
        this.code = params.get('code') || ''
        this.authCode()
      })
    }
    ipcRenderer.send(`new-account-setup`, this.instance, this.useURLScheme)
  }
  public authCode() {
    ipcRenderer.once(
      `login-complete`,
      (e: Event, account?: Account, error?: Error) => {
        if (error != undefined || account === undefined) {
          console.error(error)
          return
        }
        this.$emit('login-complete', account)
      }
    )
    ipcRenderer.send(`new-account-auth`, this.code, this.instance)
    this.code = ""
    this.instance = ''
  }
}
</script>

<style scoped lang="postcss">
</style>