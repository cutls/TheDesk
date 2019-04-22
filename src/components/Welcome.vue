<template>
  <div id="welcome">
    <img alt="Vue logo" src="@/assets/logo.png">
    <h1>Welcome to TheDesk</h1>
    <BaseButton class="primary fill" disabled>Login</BaseButton>
    <BaseButton class="primary">Streaming Public Timeline</BaseButton>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Welcome extends Vue {
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