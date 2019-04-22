<template>
  <div id="welcome">
    <img alt="Vue logo" src="@/assets/logo.png">
    <h1>Welcome TheDesk</h1>
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
  padding-top: 60px;
}
</style>