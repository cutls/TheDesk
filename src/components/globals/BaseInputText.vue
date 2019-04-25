<template>
  <input type="text" :placeholder="placeholder" v-model="input">
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  inheritAttrs: false,
})
export default class BaseInputText extends Vue {
  @Prop() public placeholder!: string
  @Prop() public value!: string

  public get input(): string {
    return this.value
  }
  public set input(newValue) {
    this.$emit('input', newValue)
  }
}
</script>

<style scoped lang="postcss">
input {
  color: var(--color);
  background-color: transparent;
  font-size: var(--font-size);
  border: none;
  border-bottom: 1px solid #9e9e9e;
  border-radius: 0;
  line-height: 3em;
  width: 80%;
  outline: none;
  margin: 1em;

  transition-duration: 0.5s;

  &:focus {
    border-color: #26d69a;
  }
}
</style>