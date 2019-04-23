<template>
  <div>
    <div v-if="showInput">
      <input type="text" placeholder="e.g:mstdn.jp" v-model="instance">
      <BaseButton
        @click.native="addTL"
        class="primary fill"
        style="font-size:.8em;"
      >Add Column</BaseButton>
    </div>
    <div id="timelines">
      <div v-for="(value, key, index) in pubTL" :key="index" class="tl">
        {{value}}
      </div>
    </div>
    <BaseButton
        v-if="!showInput"
        @click.native="showInput = true"
        class="primary fill"
        style="font-size:.8em;"
      >Show Menu</BaseButton>
  </div>
</template>

<script lang="ts">
import { ipcRenderer } from 'electron'
import { Component, Vue } from 'vue-property-decorator'

type Status = 'welcome' | 'login' | 'public_timeline'
type Instance = String
type showInput = boolean
type Timelines = String[]
@Component
export default class AddColumn extends Vue {
  public status: Status = 'welcome'
  public instance: Instance = ''
  public showInput : showInput = true
  public pubTL : Timelines = []

  public addTL() {
    this.showInput = false
    this.pubTL.push(this.instance)
    this.timeline()
  }

  public timeline(){
    this.pubTL.forEach(function( value ) {
     ipcRenderer.send('no-auth-streaming', value);
    });
  }
}
</script>=

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
#timelines{
  display:flex;
  width:100%;
}
.tl{
  height:100%;
  flex-grow: 4;
}
</style>