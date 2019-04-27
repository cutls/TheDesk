<template>
  <div id="welcome">
    <img alt="Vue logo" src="@/assets/logo.png">
    <h1>Welcome to TheDesk</h1>
    <BaseButton @click.native="status = 'login'" class="primary fill">{{ loginButton }}</BaseButton>
    <BaseButton @click.native="status = 'public_timeline'" class="primary">{{ publicTLButton }}</BaseButton>
    <BaseButton @click.native="status = 'timeline'" class="primary">{{ TLButton }}</BaseButton>

    <BaseOverlay
      v-show="status !== 'welcome'"
      @close="status = 'welcome'"
      :title="status === 'login' ? loginButton : status === 'timeline' ? TLButton : publicTLButton"
    >
      <Login v-if="status === 'login'"/>
      <PublicTimeline v-else-if="status === 'public_timeline'"/>
      <Timeline v-else-if="status === 'timeline'"/>
    </BaseOverlay>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import Login from './Preference/AccountManager.vue'
import Timeline from './Timeline/Timeline.vue'
import PublicTimeline from './AddColumn/PublicTimeline.vue'

type Status = 'welcome' | 'login' | 'public_timeline' | 'timeline'

@Component({
  components: {
    Login,
    Timeline,
    PublicTimeline,
  }
})
export default class Welcome extends Vue {
  public status: Status = 'welcome'
  public loginButton: string = 'Login'
  public publicTLButton: string = 'Streaming Public Timeline'
  public TLButton: string = 'Timeline'
}
</script>=

<style lang="postcss">
#welcome {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
}
</style>