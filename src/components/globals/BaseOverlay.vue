<template>
  <transition name="fade">
    <div class="overlay">
      <button type="button" class="close-button" @click="closeOverlay">X</button>
      <h1>{{ title }}</h1>
      <div class="overlay-inner">
        <slot/>
      </div>
    </div>
  </transition>
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.overlay {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100vw;
  max-width: 100vw;
  height: 100vh;
  max-height: 100vh;
  background-color: var(--bg-color);
}
.overlay-inner {
  margin: 0.5em;
  height: calc(100% - 50px - 1em);

  overflow: scroll;
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

  font-size: 1.5rem;
}
h1 {
  top: 0;
  line-height: 50px;
  font-size: 1.5em;
  margin: 0;
}
</style>