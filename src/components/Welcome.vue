<template>
  <div id="welcome">
    <img alt="Vue logo" src="@/assets/logo.png">
    <h1>Welcome to TheDesk</h1>
    <BaseButton @click.native="status = 'login'" class="primary fill" disabled>{{ loginButton }}</BaseButton>
    <BaseButton @click.native="status = 'public_timeline'" class="primary">{{ publicTLButton }}</BaseButton>

    <BaseOverlay
      v-show="status !== 'welcome'"
      @close="status = 'welcome'"
      :title="status === 'login' ? loginButton : publicTLButton"
    >
      <Login v-if="status === 'login'"/>
      <PublicTimeline v-else-if="status === 'public_timeline'"/>
    </BaseOverlay>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

//import Login from './Accounts/Login.vue'
import PublicTimeline from './AddColumn/PublicTimeline.vue'

type Status = 'welcome' | 'login' | 'public_timeline'

@Component({
  components: {
    //Login,
    PublicTimeline,
  }
})
export default class Welcome extends Vue {
  public status: Status = 'welcome'
  public loginButton: string = 'Login'
  public publicTLButton: string = 'Streaming Public Timeline'
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