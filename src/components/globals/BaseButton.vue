<template>
  <button :type="type || 'button'" v-bind="$attrs">
    <slot/>
  </button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  inheritAttrs: false,
})
export default class BaseButton extends Vue {
  @Prop() private type?: string
}
</script>

<style scoped lang="postcss">
button {
  --btn-color: var(--color);
  --btn-bg-color: var(--bg-color);

  &.fill {
    border-style: none;
  }

  color: var(--btn-color);
  border-color: var(--btn-color);
  background-color: var(--btn-bg-color);

  &.primary {
    --btn-color: #3388cc;

    &.fill {
      --btn-color: whitesmoke;
      --btn-bg-color: #3388cc;
    }
  }

  &:disabled {
    --btn-color: darkgray !important;
    border-style: solid !important;
    --btn-bg-color: var(--bg-color) !important;
  }

  font-size: var(--font-size);
  margin: 0 0.5em;
  padding: 0.8em 2em;

  &:hover:not(:disabled) {
    filter: brightness(120%);
  }
}
</style>