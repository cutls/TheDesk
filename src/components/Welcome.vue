<template>
  <div id="welcome">
    <img alt="Vue logo" src="@/assets/logo.png">
    <h1>Welcome to TheDesk</h1>
    <BaseButton @click.native="status = 'login'" class="primary fill">{{ loginButton }}</BaseButton>
    <BaseButton @click.native="status = 'public_timeline'" class="primary">{{ publicTLButton }}</BaseButton>

    <BaseOverlay
      v-show="status !== 'welcome'"
      @close="status = 'welcome'"
      :disableClose="status === 'select_timeline'"
      :title="status === 'login'
              ? loginButton
              : status === 'public_timeline'
              ? publicTLButton
              : status === 'select_timeline'
              ? selectTimeline : ''"
    >
      <Login v-if="status === 'login'" @login-complete="loggedIn"/>
      <PublicTimeline v-else-if="status === 'public_timeline'"/>
      <UserTimeline v-else-if="status === 'select_timeline'" :username="username"/>
    </BaseOverlay>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import Login from './Preferences/AccountAuth.vue'
import UserTimeline from './AddColumn/UserTimeline.vue'
import PublicTimeline from './AddColumn/PublicTimeline.vue'

type Status = 'welcome' | 'login' | 'public_timeline' | 'select_timeline'
interface Account {
  domain: string
  acct: string
  avatar: string
  avatarStatic: string
  accessToken?: string
}

@Component({
  components: {
    Login,
    UserTimeline,
    PublicTimeline,
  }
})
export default class Welcome extends Vue {
  public loginButton: string = 'Login'
  public publicTLButton: string = 'Streaming Public Timeline'
  public selectTimeline: string = 'Select Timeline'

  public username: string = ''
  public status: Status = 'welcome'

  public loggedIn(account: Account) {
    this.username = `${account.acct}@${account.domain}`
    this.status = 'select_timeline'
  }
}
</script>

<style lang="postcss">
#welcome {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
}
</style>