<template>
  <div class="toot" :data-status-id="status.id">
    <div class="tootAvatar">
      <!--ここは公開TLなので@clickでユーザー情報表示はない-->
      <img :src="pref.static ? status.account.avatar_static : status.account.avatar">
    </div>
    <div class="tootUser">
      {{status.account.display_name}}
      <small>@{{status.account.acct}}</small>
    </div>
    <div class="tootContent" v-html="status.content"></div>
    <div class="tootMedia" v-if="status.media_attachments">
      <div v-for="(media,mediaId) in status.media_attachments" :key="mediaId" class="tootImg">
        <img :src="media.preview_url" @click="showImage(media.url, media.type)">
      </div>
    </div>
    <div class="tootCard" v-if="status.card">
      <template v-if="status.card.description">{{status.card.title}} - {{status.card.description}}</template>
      <template v-else-if="status.card.html" v-html="status.card.html"></template>
    </div>
    <div class="tootAction">
      <!--ここは公開TLなのでふぁぼ等はなし-->
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Status } from 'megalodon'

interface Preferences {
  static?: boolean
}

@Component
export default class Toot extends Vue {
  @Prop() public status!: Status
  @Prop() public prefStatic?: boolean

  get pref(): Preferences {
    return {
      static: this.prefStatic
    }
  }

  mounted() {
    console.log(this.status)
  }
}
</script>

<style scoped lang="postcss">
.toot {
  text-align: left;
  display: grid;
  grid-template-columns: 43px 2fr 1fr;
  grid-template-areas: "avatar user user" "avatar content content" "avatar media media" "avatar card card" "avatar action action";
  .tootAvatar {
    grid-area: avatar;
    img {
      width: 100%;
    }
  }
  .tootUser {
    grid-area: user;
  }
  .tootContent {
    grid-area: content;
  }
  .tootMedia {
    grid-area: media;
  }
  .tootCard {
    grid-area: card;
  }
  .tootAction {
    grid-area: card;
  }
}
</style>