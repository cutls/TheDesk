<template>
  <div class="overlay">
    <button type="button" class="close-button" @click="closeOverlay">x</button>
    <h1>{{ title }}</h1>
    <div class="overlay-inner">
      <slot/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  inheritAttrs: false,
})
export default class BaseOverlay extends Vue {
  @Prop()
  public title?: string

  public closeOverlay() {
    this.$emit('close')
  }
}
</script>

<style scoped lang="postcss">
.overlay {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: var(--bg-color);
  width: 100vw;
  height: 100vh;
}
.overlay-inner {
  margin: 1em;
}
.close-button {
  position: fixed;
  top: 0;
  right: 0;

  color: var(--color);
  border: none;
  background-color: transparent;

  z-index: 100;

  width: 50px;
  height: 50px;

  font-size: 1.8rem;
}
h1 {
  top: 0;
  line-height: 50px;
  font-size: 1.5em;
  margin: 0;
}
</style>