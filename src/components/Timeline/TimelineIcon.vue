<template>
    <span>
        <HomeIcon :size="iconSize" v-if="tlType === 'home'"/>
        <LocalIcon :size="iconSize" v-if="tlType === 'local'"/>
        <NotifyIcon :size="iconSize" v-if="tlType === 'notify'"/>
        <DMIcon :size="iconSize" v-if="tlType === 'dm'"/>
        <FederatedIcon :size="iconSize" v-if="tlType === 'federated'"/>
        <IntegratedIcon :size="iconSize" v-if="tlType === 'integrated'"/>
        <LocalPlusIcon :size="iconSize" v-if="tlType === 'localPlus'"/>
    </span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator"

import HomeIcon from 'vue-material-design-icons/Home.vue'
import LocalIcon from 'vue-material-design-icons/Account.vue'
import NotifyIcon from 'vue-material-design-icons/Bell.vue'
import DMIcon from 'vue-material-design-icons/Email.vue'
import FederatedIcon from 'vue-material-design-icons/Earth.vue'
import IntegratedIcon from 'vue-material-design-icons/SourceMerge.vue'
import LocalPlusIcon from 'vue-material-design-icons/CallMerge.vue'


@Component({
  components: {
    HomeIcon,
    LocalIcon,
    NotifyIcon,
    DMIcon,
    FederatedIcon,
    IntegratedIcon,
    LocalPlusIcon
  }
})
export default class TimnelineIcon extends Vue {
  @Prop() public tlType!: string
  @Prop() public iconSize!: number
}
</script>