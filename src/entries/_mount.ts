import Vue, { VueConstructor } from 'vue'
import '@/components/_globals'

Vue.config.productionTip = false

export default function(render: VueConstructor) {
  new Vue({
    render: h => h(render),
  }).$mount('#app')
}