<template>
  <div class="toot" :data-status-id="status.id">
    <div class="toot-avatar">
      <!--ここは公開TLなので@clickでユーザー情報表示はない-->
      <img :src="pref.static ? status.account.avatar_static : status.account.avatar">
    </div>
    <div class="toot-user">
      {{status.account.display_name}}
      <small>@{{status.account.acct}}</small>
    </div>
    <div class="toot-content" v-html="status.content"></div>
    <div class="toot-media" v-if="status.media_attachments">
      <div v-for="(media,mediaId) in status.media_attachments" :key="mediaId" class="media-item">
        <img
          v-if="media.type === 'image'"
          :src="media.preview_url"
          @click="showImage(media.url, media.type)"
        >
      </div>
    </div>
    <div class="toot-card" v-if="status.card">
      <template v-if="status.card.description">{{status.card.title}} - {{status.card.description}}</template>
      <template v-else-if="status.card.html" v-html="status.card.html"></template>
    </div>
    <div class="toot-visibility">
      <!--公開TLなので常にPublic-->
      <PublicIcon :size="13"/>
    </div>
    <div class="toot-action">
      <!--ここは公開TLなのでふぁぼ等はなし-->
    </div>
    <div class="toot-subaction">
      <!--公開TLなので展開はひとまず非表示-->
      <span class="more-action" v-if="false" @click="isMoreAction = !isMoreAction">
        <ChangeToNormal :size="16" v-if="isMoreAction"/>
        <ChangeToAlt :size="16" v-else/>
      </span>
      <MoreIcon :size="16"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Status } from 'megalodon'
import ChangeToAlt from 'vue-material-design-icons/ChevronDown.vue'
import ChangeToNormal from 'vue-material-design-icons/ChevronUp.vue'
import MoreIcon from 'vue-material-design-icons/DotsVertical.vue'
import PublicIcon from 'vue-material-design-icons/Earth.vue'

interface Preferences {
  static?: boolean
}

@Component({
  components: {
    ChangeToAlt,
    ChangeToNormal,
    MoreIcon,
    PublicIcon,
  }
})
export default class Toot extends Vue {
  @Prop() public status!: Status
  @Prop() public prefStatic?: boolean

  public isMoreAction: boolean = false

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
  grid-template-columns: 2.7em 2fr 1fr;
  grid-template-areas:
    "avatar user    date"
    "avatar content content"
    "avatar media   media"
    "avatar card    card"
    "vis    action  subaction";
  .avatar {
    grid-area: avatar;
    height: 2.7em;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .toot-user {
    grid-area: user;
  }
  .toot-content {
    grid-area: content;
    /deep/ p {
      margin: 0;
    }
  }
  .toot-media {
    grid-area: media;
  }
  .toot-card {
    grid-area: card;
  }
  .toot-visibility {
    grid-area: vis;
    text-align: center;
  }
  .toot-action {
    grid-area: action;
  }
  .toot-subaction {
    grid-area: subaction;
    text-align: right;
  }
}
</style>